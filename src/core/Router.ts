type RouteParams = Map<string, string>;

export type RouteCleanup = () => void;
export type RouteRenderResult = void | RouteCleanup | Promise<void | RouteCleanup>;
export type RouteComponent = (props: RouterProps) => RouteRenderResult;
export type RouteLayout = (
  component?: RouteComponent,
  props?: RouterProps,
) => RouteRenderResult;

export type RouterProps = {
  queryString?: string;
  query?: URLSearchParams;
  params?: RouteParams;
  baseUrl?: string;
  path?: string;
  router?: Router;
  route?: Route;
  [key: string]: any;
};

export type Route = {
  path: string;
  component?: RouteComponent;
  layout?: RouteLayout;
  props?: RouterProps;
  pathSegments?: string[];
};

export type RouteList = Route[];

export type RouterOptions = {
  routes?: RouteList;
  baseUrl?: string;
  interceptLinks?: boolean;
  linkSelector?: string;
};

export type RouterMemo = {
  [key: string]: string;
};

type RouteMatch = {
  route: Route;
  params: RouteParams;
};

/**
 * A small browser router for simple SPA navigation.
 */
export default class Router {
  routes: RouteList;
  baseUrl: string;
  basePath: string;
  queryString: string;
  path: string;
  query: URLSearchParams;
  params: RouteParams;
  memo: RouterMemo;
  interceptLinks: boolean;
  linkSelector: string;
  currentRoute: Route | null;
  currentCleanup: RouteCleanup | null;
  started: boolean;

  constructor(options: RouterOptions = {}) {
    const {
      routes = [],
      baseUrl = "",
      interceptLinks = true,
      linkSelector = 'a[href]',
    } = options;

    this.routes = routes.map((route) => ({
      ...route,
      pathSegments: this.getPathSegments(route.path),
    }));
    this.baseUrl = baseUrl || window.location.origin;
    this.basePath = this.getBasePath(this.baseUrl);
    this.queryString = "";
    this.path = "/";
    this.query = new URLSearchParams();
    this.params = new Map();
    this.memo = {};
    this.interceptLinks = interceptLinks;
    this.linkSelector = linkSelector;
    this.currentRoute = null;
    this.currentCleanup = null;
    this.started = false;

    this.updateLocation(window.location.href);
  }

  /**
   * Initializes the router, starts listening for browser navigation,
   * and renders the current location.
   */
  async init(): Promise<string> {
    this.start();
    return this.render(window.location.href);
  }

  /**
   * Starts browser listeners without performing navigation.
   */
  start(): void {
    if (this.started) return;

    if (this.interceptLinks) {
      document.addEventListener("click", this.handleDocumentClick);
    }
    window.addEventListener("popstate", this.handlePopState);
    this.started = true;
  }

  /**
   * Stops browser listeners and runs the active route cleanup, if any.
   */
  destroy(): void {
    if (this.started) {
      document.removeEventListener("click", this.handleDocumentClick);
      window.removeEventListener("popstate", this.handlePopState);
      this.started = false;
    }

    this.runCleanup();
    this.currentRoute = null;
  }

  /**
   * Navigates to a path using the History API and renders the target route.
   */
  async navigate(
    to: string,
    options: { replace?: boolean; state?: any } = {},
  ): Promise<string> {
    const nextUrl = this.createUrl(to);
    const nextLocation = this.getLocationSignature(nextUrl);
    const currentLocation = this.getLocationSignature(new URL(window.location.href));

    if (nextLocation !== currentLocation) {
      const method = options.replace ? "replaceState" : "pushState";
      window.history[method](options.state ?? {}, "", nextUrl.toString());
    }

    return this.render(nextUrl);
  }

  private readonly handleDocumentClick = (event: MouseEvent): void => {
    if (!this.interceptLinks) return;
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest(this.linkSelector);
    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target && anchor.target !== "_self") return;
    if (anchor.hasAttribute("download")) return;

    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("#")) return;

    const nextUrl = new URL(anchor.href, window.location.href);
    if (nextUrl.origin !== window.location.origin) return;
    if (!this.isInsideBasePath(nextUrl)) return;

    event.preventDefault();
    void this.navigate(nextUrl.pathname + nextUrl.search + nextUrl.hash).catch((error) => {
      console.error(error);
    });
  };

  private readonly handlePopState = (): void => {
    void this.render(window.location.href).catch((error) => {
      console.error(error);
    });
  };

  private async render(nextLocation: string | URL): Promise<string> {
    const nextUrl = nextLocation instanceof URL
      ? nextLocation
      : new URL(nextLocation, window.location.origin);

    const nextState = this.getResolvedLocation(nextUrl);
    const match = this.matchRoute(nextState.path);

    if (!match) {
      throw new Error(`Route ${nextState.path} not found`);
    }

    this.runCleanup();
    this.queryString = nextState.queryString;
    this.path = nextState.path;
    this.query = nextState.query;
    this.params = match.params;

    const route = match.route;
    const props: RouterProps = {
      ...route.props,
      queryString: this.queryString,
      query: this.query,
      params: this.params,
      baseUrl: this.baseUrl,
      path: this.path,
      route,
      router: this,
    };

    route.props = props;
    this.currentRoute = route;

    const cleanup = route.layout
      ? await route.layout(route.component, props)
      : route.component
        ? await route.component(props)
        : undefined;

    if (!route.layout && !route.component) {
      throw new Error("Route component or layout not found");
    }

    this.currentCleanup = typeof cleanup === "function" ? cleanup : null;
    this.memo[this.path] = route.path;

    return this.path;
  }

  private runCleanup(): void {
    if (!this.currentCleanup) return;

    const cleanup = this.currentCleanup;
    this.currentCleanup = null;
    cleanup();
  }

  private matchRoute(path: string): RouteMatch | null {
    const pathSegments = this.getPathSegments(path);

    for (const route of this.routes) {
      if (!route.pathSegments || route.pathSegments.length !== pathSegments.length) {
        continue;
      }

      const params = new Map<string, string>();
      let matches = true;

      for (let index = 0; index < route.pathSegments.length; index += 1) {
        const routeSegment = route.pathSegments[index];
        const pathSegment = pathSegments[index];

        if (typeof routeSegment !== "string" || typeof pathSegment !== "string") {
          matches = false;
          break;
        }

        if (routeSegment.startsWith(":")) {
          params.set(routeSegment.slice(1), pathSegment);
          continue;
        }

        if (routeSegment !== pathSegment) {
          matches = false;
          break;
        }
      }

      if (matches) {
        return { route, params };
      }
    }

    return null;
  }

  private updateLocation(nextLocation: string | URL): void {
    const nextUrl = nextLocation instanceof URL
      ? nextLocation
      : new URL(nextLocation, window.location.origin);
    const nextState = this.getResolvedLocation(nextUrl);

    this.queryString = nextState.queryString;
    this.path = nextState.path;
    this.query = nextState.query;
  }

  private getResolvedLocation(url: URL): {
    path: string;
    queryString: string;
    query: URLSearchParams;
  } {
    const hashPath = url.hash.startsWith("#/") ? url.hash.slice(1) : "";

    if (hashPath) {
      const hashUrl = new URL(hashPath, url.origin);
      return {
        path: this.normalizePath(hashUrl.pathname),
        queryString: hashUrl.search,
        query: new URLSearchParams(hashUrl.search),
      };
    }

    const pathWithoutBase = this.stripBasePath(url.pathname);
    return {
      path: this.normalizePath(pathWithoutBase),
      queryString: url.search,
      query: new URLSearchParams(url.search),
    };
  }

  private createUrl(to: string): URL {
    if (/^https?:\/\//.test(to)) {
      const absoluteUrl = new URL(to);
      if (absoluteUrl.origin !== window.location.origin) {
        throw new Error("Router can only navigate within the current origin");
      }

      return absoluteUrl;
    }

    if (to.startsWith("#/")) {
      const url = new URL(window.location.href);
      url.hash = to;
      return url;
    }

    const normalizedPath = this.normalizePath(to);
    const relativePath = this.basePath === "/"
      ? normalizedPath
      : `${this.basePath}${normalizedPath === "/" ? "" : normalizedPath}`;

    return new URL(relativePath, this.baseUrl);
  }

  private getLocationSignature(url: URL): string {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  private getBasePath(baseUrl: string): string {
    if (!baseUrl) return "/";

    const url = new URL(baseUrl, window.location.origin);
    return this.normalizePath(url.pathname);
  }

  private stripBasePath(pathname: string): string {
    const normalizedPath = this.normalizePath(pathname);
    if (this.basePath === "/") return normalizedPath;

    if (normalizedPath === this.basePath) {
      return "/";
    }

    if (normalizedPath.startsWith(`${this.basePath}/`)) {
      return normalizedPath.slice(this.basePath.length) || "/";
    }

    return normalizedPath;
  }

  private isInsideBasePath(url: URL): boolean {
    const normalizedPath = this.normalizePath(url.pathname);
    if (this.basePath === "/") return true;
    return normalizedPath === this.basePath || normalizedPath.startsWith(`${this.basePath}/`);
  }

  private normalizePath(path: string): string {
    if (!path) return "/";

    const [pathname, search = ""] = path.split("?");
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    const collapsedPath = normalizedPath.replace(/\/{2,}/g, "/");
    const trimmedPath = collapsedPath.length > 1 ? collapsedPath.replace(/\/$/, "") : collapsedPath;

    return search ? `${trimmedPath}?${search}` : trimmedPath;
  }

  private getPathSegments(path: string): string[] {
    return this.normalizePath(path).split("?")[0].split("/");
  }
}
