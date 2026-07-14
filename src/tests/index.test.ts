import Paradox from "../index";

const { buildElement, Router, pubsub } = Paradox;
const { delegate } = Paradox;
import { ParadoxElementOptions } from "../core/buildElement/types";

describe('Paradox', () => {
  it("should be an object", () => {
    expect(typeof Paradox).toBe("object");
  });

  it('should have buildElement property', () => {
    expect(Paradox.hasOwnProperty("buildElement")).toBe(true);
  });

  describe('buildElement', () => {
    it("should be a function", () => {
      expect(typeof buildElement).toBe("function");
    });

    it ("should return an HTMLElement", () => {
      const element = buildElement("div");
      expect(element instanceof HTMLElement).toBe(true);
    });

    describe("options", () => {
      it("should apply id, classes, text, attributes, data, aria, and style", () => {
        const element = buildElement("section", {
          id: "test",
          className: ["card", "rounded"],
          classList: "shadow-sm",
          text: "hello",
          attributes: {
            title: "Paradox",
            hidden: false,
            draggable: true,
          },
          data: {
            userId: 42,
          },
          aria: {
            label: "Greeting card",
          },
          style: {
            color: "red",
            zIndex: 3,
            "--card-tone": "warm",
          },
        } as ParadoxElementOptions);

        expect(element.id).toBe("test");
        expect(element.className).toBe("card rounded shadow-sm");
        expect(element.textContent).toBe("hello");
        expect(element.getAttribute("title")).toBe("Paradox");
        expect(element.hasAttribute("hidden")).toBe(false);
        expect(element.getAttribute("draggable")).toBe("");
        expect(element.getAttribute("data-user-id")).toBe("42");
        expect(element.getAttribute("aria-label")).toBe("Greeting card");
        expect(element.style.color).toBe("red");
        expect(element.style.zIndex).toBe("3");
        expect(element.style.getPropertyValue("--card-tone")).toBe("warm");
      });

      it("should append text, descriptors, nodes, nested arrays, and numbers as children", () => {
        const existingNode = document.createElement("strong");
        existingNode.textContent = "existing";

        const element = buildElement("div", {
          text: "prefix",
          children: [
            " message ",
            7,
            false,
            null,
            undefined,
            existingNode,
            {
              tag: "span",
              options: {
                text: "child",
              },
            },
            [
              {
                tag: "em",
                options: {
                  text: "nested",
                },
              },
            ],
          ],
        });

        expect(element.textContent).toBe("prefix message 7existingchildnested");
        expect(element.querySelector("strong")?.textContent).toBe("existing");
        expect(element.querySelector("span")?.textContent).toBe("child");
        expect(element.querySelector("em")?.textContent).toBe("nested");
      });

      it("should support multiple event handlers predictably", () => {
        const firstHandler = jest.fn();
        const secondHandler = jest.fn();

        const button = buildElement("button", {
          events: {
            click: [firstHandler, secondHandler],
          },
        });

        button.click();

        expect(firstHandler).toHaveBeenCalledTimes(1);
        expect(secondHandler).toHaveBeenCalledTimes(1);
      });

      it("should preserve legacy descriptor children for compatibility", () => {
        const element = buildElement("div", {
          children: [
            { tag: "span" },
            {
              tag: "span",
              options: {
                children: [
                  { tag: "span", options: { text: "nested child" } },
                ],
              },
            },
          ],
        });

        expect(element.children.length).toBe(2);
        expect(element.children[1]?.children.length).toBe(1);
        expect(element.children[1]?.children[0]?.textContent).toBe("nested child");
      });
    });
  });

  it('should have Router property', () => {
    expect(Paradox.hasOwnProperty("Router")).toBe(true);
  });

  it("should have delegate property", () => {
    expect(Paradox.hasOwnProperty("delegate")).toBe(true);
  });

  describe("delegate", () => {
    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("should be a function", () => {
      expect(typeof delegate).toBe("function");
    });

    it("should trigger a delegated handler for a matching selector", () => {
      document.body.innerHTML = `
        <button data-role="refresh-dashboard">
          <span>Refresh preview</span>
        </button>
      `;

      const handler = jest.fn();
      const cleanup = delegate(document, {
        click: {
          '[data-role="refresh-dashboard"]': handler,
        },
      });

      document.querySelector("span")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );

      expect(handler).toHaveBeenCalledTimes(1);
      cleanup();
    });

    it("should pass the matched element to the delegated handler", () => {
      document.body.innerHTML = `
        <button data-role="refresh-dashboard">
          <span>Refresh preview</span>
        </button>
      `;

      const handler = jest.fn();
      const cleanup = delegate(document, {
        click: {
          '[data-role="refresh-dashboard"]': handler,
        },
      });

      document.querySelector("span")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );

      expect(handler.mock.calls[0][1]).toBe(
        document.querySelector('[data-role="refresh-dashboard"]'),
      );
      cleanup();
    });

    it("should support multiple delegated handlers for the same selector", () => {
      document.body.innerHTML = `<button data-role="refresh-dashboard">Refresh</button>`;

      const firstHandler = jest.fn();
      const secondHandler = jest.fn();
      const cleanup = delegate(document, {
        click: {
          '[data-role="refresh-dashboard"]': [firstHandler, secondHandler],
        },
      });

      document.querySelector("button")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );

      expect(firstHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledTimes(1);
      cleanup();
    });

    it("should respect the provided root element scope", () => {
      document.body.innerHTML = `
        <section id="inside">
          <button data-role="refresh-dashboard">Inside</button>
        </section>
        <section id="outside">
          <button data-role="refresh-dashboard">Outside</button>
        </section>
      `;

      const handler = jest.fn();
      const root = document.querySelector("#inside") as HTMLElement;
      const cleanup = delegate(root, {
        click: {
          '[data-role="refresh-dashboard"]': handler,
        },
      });

      document.querySelector("#outside button")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );
      document.querySelector("#inside button")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );

      expect(handler).toHaveBeenCalledTimes(1);
      cleanup();
    });

    it("should return a cleanup function that removes the listeners", () => {
      document.body.innerHTML = `<button data-role="refresh-dashboard">Refresh</button>`;

      const handler = jest.fn();
      const cleanup = delegate(document, {
        click: {
          '[data-role="refresh-dashboard"]': handler,
        },
      });

      cleanup();

      document.querySelector("button")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Router', () => {
    it("should be a function", () => {
      expect(typeof Router).toBe("function");
    });

    function Home() {
      document.body.innerHTML = `<div>Home <a href="/about?hello=world">About</a></div>`;
    }

    const routes = [
      { path: "/", component: Home },
    ];
    let router: InstanceType<typeof Router>;

    beforeEach(() => {
      document.body.innerHTML = "";
      router = new Router({ routes, baseUrl: "http://localhost" });
    });

    describe("Objcet properties", () => {

      it("should have routes property", () => {
        expect(router.hasOwnProperty("routes")).toBe(true);
      });

      it("should have baseUrl property", () => {
        expect(router.hasOwnProperty("baseUrl")).toBe(true);
      });

      it("should have path property", () => {
        expect(router.hasOwnProperty("path")).toBe(true);
      });

      it("should have queryString property", () => {
        expect(router.hasOwnProperty("queryString")).toBe(true);
      });

      it("should have params property", () => {
        expect(router.hasOwnProperty("params")).toBe(true);
      });

      it("should have memo property", () => {
        expect(router.hasOwnProperty("memo")).toBe(true);
      });

      it("should have init method", () => {
        expect(typeof router.init).toBe("function");
      });
    });

    describe("init", () => {
      beforeEach(() => {
        router.init();
      });
      
      it("should set the path", () => {
        expect(router.path).toBe("/");
      });

      describe("/ route", () => {

        it("Should append the component to the DOM", () => {
          expect(document.body.innerHTML).toBe(`<div>Home <a href="/about?hello=world">About</a></div>`);
        });

        it("should set the memo", () => {
          expect(router.memo["/"]).toBeDefined();
        });

        it("should set the queryString", () => {
          expect(router.queryString).toBe("");
        });

        it("should set the params", () => {
          expect(router.params.size).toBe(0);
        });

        it("should set the query", () => {
          expect(router.query.toString()).toBe("");
        });

        it("should set the props", () => {
          expect(router.routes[0].props).toBeDefined();
        });
      });

      describe("/user/:id route", () => {
        let userRouter: InstanceType<typeof Router>;
        const routes = [
          { path: "/", component: Home },
          { path: "/user/:id", component: Home },
        ];

        beforeEach(() => {
          userRouter = new Router({ routes, baseUrl: "http://localhost" });
          userRouter.init();
        });

        it("should set pathSegments", () => {
          expect(userRouter.routes[1].pathSegments).toEqual(["", "user", ":id"]);
        });
      });
    });
  });

  it('should have pubsub property', () => {
    expect(Paradox.hasOwnProperty("pubsub")).toBe(true);
  });

  describe('pubsub', () => {
    it("should be an object", () => {
      expect(typeof pubsub).toBe("object");
    });

    it("should have events property", () => {
      expect(pubsub.hasOwnProperty("events")).toBe(true);
    });

    it("should have subscribe method", () => {
      expect(typeof pubsub.subscribe).toBe("function");
    });

    it("should have unsubscribe method", () => {
      expect(typeof pubsub.unsubscribe).toBe("function");
    });

    it("should have publish method", () => {
      expect(typeof pubsub.publish).toBe("function");
    });
  
    it("should initialize with an empty events object", () => {
      expect(pubsub.events).toEqual({});
    });
    const event = "testEvent";
    const callback = jest.fn();
    const callback1 = jest.fn().mockReturnValue("result1");;
    const callback2 = jest.fn().mockReturnValue("result2");;
  
    describe("subscribe", () => {
      it("should add a callback to the specified event", () => {
        pubsub.subscribe(event, callback);
  
        expect(pubsub.events[event]).toBeDefined();
        expect(pubsub.events[event].size).toBe(1);
        expect(pubsub.events[event].has(callback)).toBe(true);
      });
  
      it("should return the number of callbacks subscribed to the event", () => {
  
        const result1 = pubsub.subscribe(event, callback1);
        expect(result1.size).toBe(2);

        const result2 = pubsub.subscribe(event, callback2);
        expect(result2.size).toBe(3);
      });
    });
  
    describe("unsubscribe", () => {
      it("should remove a callback from the specified event", () => {
        const event = "testEvent";
  
        pubsub.unsubscribe(event, callback);
  
        expect(pubsub.events[event]).toBeDefined();
        expect(pubsub.events[event].size).toBe(2);
        expect(pubsub.events[event].has(callback)).toBe(false);
      });
  
      it("should return the remaining callbacks subscribed to the event", () => {
        const result = pubsub.unsubscribe(event, callback1);
        expect(result).toEqual(new Set([callback2]));
      });
    });
  
    describe("publish", () => {
      it("should call the callbacks subscribed to the specified event", () => {
        const event = "testEvent";
        const data = { message: "Hello, world!" };
  
        pubsub.publish(event, data);
  
        expect(callback2).toHaveBeenCalledWith(data);
      });
  
      it("should return an array of return values from the event subscribers", () => {
        const data = { message: "Hello, world!" };
  
        pubsub.subscribe(event, callback1);
        pubsub.subscribe(event, callback2);
  
        const result = pubsub.publish(event, data);
  
        expect(result.sort()).toEqual(["result1", "result2"]);
      });
  
      it("should call the callbacks subscribed to the wildcard event (*)", () => {
        const wildcardEvent = "*";
        const data = { message: "Hello, world!" };
  
        pubsub.subscribe(event, callback1);
        pubsub.subscribe(wildcardEvent, callback2);
  
        pubsub.publish(event, data);
  
        expect(callback1).toHaveBeenCalledWith(data);
        expect(callback2).toHaveBeenCalledWith(data);
      });
    });
  });
});
