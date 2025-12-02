package auth

import (
	"context"
	"time"

	"github.com/sorteos-platform/backend/internal/domain"
	"github.com/sorteos-platform/backend/pkg/crypto"
	"github.com/sorteos-platform/backend/pkg/errors"
	"github.com/sorteos-platform/backend/pkg/logger"
)

// ResendVerificationInput representa los datos de entrada para reenviar código
type ResendVerificationInput struct {
	UserID int64 `json:"user_id" binding:"required"`
}

// ResendVerificationOutput representa los datos de salida
type ResendVerificationOutput struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

// ResendVerificationUseCase maneja el reenvío de códigos de verificación
type ResendVerificationUseCase struct {
	userRepo  domain.UserRepository
	auditRepo domain.AuditLogRepository
	tokenMgr  TokenManager
	notifier  Notifier
	logger    *logger.Logger
}

// NewResendVerificationUseCase crea una nueva instancia del use case
func NewResendVerificationUseCase(
	userRepo domain.UserRepository,
	auditRepo domain.AuditLogRepository,
	tokenMgr TokenManager,
	notifier Notifier,
	logger *logger.Logger,
) *ResendVerificationUseCase {
	return &ResendVerificationUseCase{
		userRepo:  userRepo,
		auditRepo: auditRepo,
		tokenMgr:  tokenMgr,
		notifier:  notifier,
		logger:    logger,
	}
}

// Execute ejecuta el caso de uso de reenvío de código de verificación
func (uc *ResendVerificationUseCase) Execute(ctx context.Context, input *ResendVerificationInput, ip, userAgent string) (*ResendVerificationOutput, error) {
	// Buscar usuario
	user, err := uc.userRepo.FindByID(input.UserID)
	if err != nil {
		uc.logger.Error("Error finding user for resend verification", logger.Error(err))
		return nil, errors.ErrUserNotFound
	}

	// Verificar que el email no esté ya verificado
	if user.EmailVerified {
		return &ResendVerificationOutput{
			Success: true,
			Message: "Tu email ya está verificado",
		}, nil
	}

	// Verificar que el usuario esté activo
	if !user.IsActive() {
		return nil, errors.New("ACCOUNT_INACTIVE", "Tu cuenta no está activa", 403, nil)
	}

	// Generar nuevo código de verificación
	code, err := crypto.GenerateVerificationCode()
	if err != nil {
		uc.logger.Error("Error generating verification code", logger.Error(err))
		return nil, errors.Wrap(errors.ErrInternalServer, err)
	}

	// Guardar código en Redis (expira en 15 minutos)
	// Esto sobrescribe cualquier código anterior
	if err := uc.tokenMgr.StoreVerificationCode(user.ID, "email", code, 15*time.Minute); err != nil {
		uc.logger.Error("Error storing verification code", logger.Error(err))
		return nil, errors.Wrap(errors.ErrInternalServer, err)
	}

	// Enviar email de verificación
	if err := uc.notifier.SendVerificationEmail(user.Email, code); err != nil {
		uc.logger.Error("Error sending verification email",
			logger.String("email", user.Email),
			logger.Error(err),
		)
		return nil, errors.New("EMAIL_SEND_FAILED", "No se pudo enviar el email de verificación. Por favor intenta más tarde.", 500, err)
	}

	// Registrar en audit log
	auditLog := domain.NewAuditLog(domain.AuditActionEmailVerified).
		WithUser(user.ID).
		WithDescription("Código de verificación reenviado").
		WithRequest(ip, userAgent, "/auth/resend-verification", "POST", 200).
		Build()

	if err := uc.auditRepo.Create(auditLog); err != nil {
		uc.logger.Warn("Error creating audit log", logger.Error(err))
	}

	uc.logger.Info("Verification code resent",
		logger.Int64("user_id", user.ID),
		logger.String("email", user.Email),
	)

	return &ResendVerificationOutput{
		Success: true,
		Message: "Se ha enviado un nuevo código de verificación a tu email",
	}, nil
}
