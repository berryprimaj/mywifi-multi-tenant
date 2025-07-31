<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     */
    public function render($request, Throwable $exception)
    {
        // Handle API requests with JSON responses
        if ($request->expectsJson()) {
            return $this->handleApiException($request, $exception);
        }

        return parent::render($request, $exception);
    }

    /**
     * Handle API exceptions with consistent JSON responses
     */
    protected function handleApiException($request, Throwable $exception)
    {
        $response = [
            'success' => false,
            'message' => 'An error occurred',
            'errors' => []
        ];

        if ($exception instanceof ValidationException) {
            $response['message'] = 'Validation failed';
            $response['errors'] = $exception->errors();
            return response()->json($response, 422);
        }

        if ($exception instanceof AuthenticationException) {
            $response['message'] = 'Unauthenticated';
            return response()->json($response, 401);
        }

        if ($exception instanceof AuthorizationException) {
            $response['message'] = 'Unauthorized';
            return response()->json($response, 403);
        }

        if ($exception instanceof ModelNotFoundException) {
            $response['message'] = 'Resource not found';
            return response()->json($response, 404);
        }

        if ($exception instanceof NotFoundHttpException) {
            $response['message'] = 'Endpoint not found';
            return response()->json($response, 404);
        }

        if ($exception instanceof MethodNotAllowedHttpException) {
            $response['message'] = 'Method not allowed';
            return response()->json($response, 405);
        }

        // For other exceptions, check if we're in debug mode
        if (config('app.debug')) {
            $response['message'] = $exception->getMessage();
            $response['file'] = $exception->getFile();
            $response['line'] = $exception->getLine();
            $response['trace'] = $exception->getTrace();
        } else {
            $response['message'] = 'Internal server error';
        }

        return response()->json($response, 500);
    }
}
