package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/sorteos-platform/backend/internal/usecase/auth"
	"github.com/sorteos-platform/backend/pkg/errors"
	"github.com/sorteos-platform/backend/pkg/logger"
)

// ResendVerificationHandler maneja el endpoint de reenvío de código de verificación
type ResendVerificationHandler struct {
	useCase *auth.ResendVerificationUseCase
	logger  *logger.Logger
}

// NewResendVerificationHandler crea una nueva instancia del handler
func NewResendVerificationHandler(useCase *auth.ResendVerificationUseCase, logger *logger.Logger) *ResendVerificationHandler {
	return &ResendVerificationHandler{
		useCase: useCase,
		logger:  logger,
	}
}

// Handle maneja la petición de reenvío de código de verificación
func (h *ResendVerificationHandler) Handle(c *gin.Context) {
	var input auth.ResendVerificationInput

	// Parsear JSON
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, ErrorResponse{
			Code:    "INVALID_INPUT",
			Message: "Datos de entrada inválidos: " + err.Error(),
		})
		return
	}

	// Obtener IP y User-Agent
	ip := c.ClientIP()
	userAgent := c.Request.UserAgent()

	// Ejecutar caso de uso
	output, err := h.useCase.Execute(c.Request.Context(), &input, ip, userAgent)
	if err != nil {
		h.handleError(c, err)
		return
	}

	// Respuesta exitosa
	c.JSON(http.StatusOK, gin.H{
		"success": output.Success,
		"message": output.Message,
	})
}

// handleError maneja los errores y retorna la respuesta apropiada
func (h *ResendVerificationHandler) handleError(c *gin.Context, err error) {
	appErr, ok := err.(*errors.AppError)
	if !ok {
		h.logger.Error("Unexpected error in resend verification handler", logger.Error(err))
		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Code:    "INTERNAL_SERVER_ERROR",
			Message: "Error interno del servidor",
		})
		return
	}

	c.JSON(appErr.Status, ErrorResponse{
		Code:    appErr.Code,
		Message: appErr.Message,
	})
}
