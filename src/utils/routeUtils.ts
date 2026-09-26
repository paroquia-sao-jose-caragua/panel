export const routeUtils = {
  isAuthRoute: (pathname: string): boolean => {
    const authRoutePatterns = [
      /^\/entrar\/?$/,
      /^\/login\/?$/,
      /^\/confirm-code\/?$/,
      /^\/esqueci-minha-senha\/?$/,
      /^\/redefinir-senha\/?$/,
    ];

    return authRoutePatterns.some((pattern) => pattern.test(pathname));
  },
};
