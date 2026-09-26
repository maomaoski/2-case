(() => {
  const viewport = document.querySelector("[data-board-viewport]");
  const world = document.querySelector("[data-board-world]");
  const drawingLayer = document.querySelector("[data-drawing-layer]");
  const toolButtons = [...document.querySelectorAll("[data-tool]")];
  const colorButtons = [...document.querySelectorAll("[data-color]")];
  const thicknessControl = document.querySelector("[data-stroke-width]");

  if (!viewport || !world || !drawingLayer) return;

  let zoom = Math.min(1, Math.max(0.2, (window.innerWidth - 110) / 760));
  let panX = Math.max(0, 86 - window.innerWidth / 2 + 410 * zoom);
  let panY = 0;
  let activeTool = "pan";
  let activeColor = colorButtons[0]?.dataset.color || "#28352c";
  let gesture = null;

  const render = () => {
    world.style.setProperty("--pan-x", `${panX}px`);
    world.style.setProperty("--pan-y", `${panY}px`);
    world.style.setProperty("--zoom", zoom);
  };

  const toBoardPoint = (event) => {
    const bounds = viewport.getBoundingClientRect();
    return {
      x: (event.clientX - bounds.left - bounds.width / 2 - panX) / zoom + 600,
      y: (event.clientY - bounds.top - bounds.height / 2 - panY) / zoom + 425,
    };
  };

  const createSvgElement = (name, attributes) => {
    const element = document.createElementNS("http://www.w3.org/2000/svg", name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    drawingLayer.append(element);
    return element;
  };

  const insertText = (point) => {
    const input = document.createElement("input");
    input.className = "board-text-input";
    input.type = "text";
    input.setAttribute("aria-label", "Текст на доске");
    input.style.left = `${point.x}px`;
    input.style.top = `${point.y}px`;
    world.append(input);
    input.focus();

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const value = input.value.trim();
      if (value) {
        const text = createSvgElement("text", {
          x: point.x,
          y: point.y + 20,
          fill: activeColor,
          "font-size": 22,
          "font-family": "Plus Jakarta Sans, sans-serif",
        });
        text.textContent = value;
      }
      input.remove();
    };

    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        finish();
      } else if (event.key === "Escape") {
        finished = true;
        input.remove();
      }
    });
    input.addEventListener("blur", finish);
  };

  const createDrawing = (tool, point) => {
    const strokeWidth = thicknessControl?.value || 4;
    const common = {
      stroke: activeColor,
      "stroke-width": strokeWidth,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      fill: "none",
    };

    if (tool === "pen") {
      return createSvgElement("path", { ...common, d: `M ${point.x} ${point.y}` });
    }
    if (tool === "rectangle") {
      return createSvgElement("rect", { ...common, x: point.x, y: point.y, width: 0, height: 0, rx: 2 });
    }
    if (tool === "ellipse") {
      return createSvgElement("ellipse", { ...common, cx: point.x, cy: point.y, rx: 0, ry: 0 });
    }
    return createSvgElement("line", { ...common, x1: point.x, y1: point.y, x2: point.x, y2: point.y });
  };

  const updateDrawing = (drawing, start, current) => {
    if (activeTool === "pen") {
      drawing.setAttribute("d", `${drawing.getAttribute("d")} L ${current.x} ${current.y}`);
    } else if (activeTool === "rectangle") {
      drawing.setAttribute("x", Math.min(start.x, current.x));
      drawing.setAttribute("y", Math.min(start.y, current.y));
      drawing.setAttribute("width", Math.abs(current.x - start.x));
      drawing.setAttribute("height", Math.abs(current.y - start.y));
    } else if (activeTool === "ellipse") {
      drawing.setAttribute("cx", (start.x + current.x) / 2);
      drawing.setAttribute("cy", (start.y + current.y) / 2);
      drawing.setAttribute("rx", Math.abs(current.x - start.x) / 2);
      drawing.setAttribute("ry", Math.abs(current.y - start.y) / 2);
    } else if (activeTool === "line") {
      drawing.setAttribute("x2", current.x);
      drawing.setAttribute("y2", current.y);
    }
  };

  toolButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeTool = button.dataset.tool;
      toolButtons.forEach((toolButton) => {
        toolButton.classList.toggle("is-selected", toolButton === button);
        toolButton.setAttribute("aria-pressed", String(toolButton === button));
      });
      viewport.classList.toggle("is-drawing", activeTool !== "pan");
    });
  });

  colorButtons.forEach((button) => {
    button.style.setProperty("--swatch", button.dataset.color);
    button.addEventListener("click", () => {
      activeColor = button.dataset.color;
      colorButtons.forEach((colorButton) => {
        const selected = colorButton === button;
        colorButton.classList.toggle("is-selected", selected);
        colorButton.setAttribute("aria-pressed", String(selected));
      });
    });
  });

  viewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    if (event.target.closest(".board-text-input")) return;
    const point = toBoardPoint(event);
    if (activeTool === "text") return;

    const drawing = activeTool === "pan" ? null : createDrawing(activeTool, point);
    gesture = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, point, drawing };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.toggle("is-panning", activeTool === "pan");
  });

  viewport.addEventListener("click", (event) => {
    if (activeTool !== "text" || event.target.closest(".board-text-input")) return;
    event.preventDefault();
    insertText(toBoardPoint(event));
  });

  viewport.addEventListener("pointermove", (event) => {
    if (event.pointerId !== gesture?.pointerId) return;
    if (activeTool === "pan") {
      panX += event.clientX - gesture.x;
      panY += event.clientY - gesture.y;
      gesture.x = event.clientX;
      gesture.y = event.clientY;
      render();
    } else {
      updateDrawing(gesture.drawing, gesture.point, toBoardPoint(event));
    }
  });

  const stopPanning = (event) => {
    if (event.pointerId !== gesture?.pointerId) return;
    gesture = null;
    viewport.classList.remove("is-panning");
  };

  viewport.addEventListener("pointerup", stopPanning);
  viewport.addEventListener("pointercancel", stopPanning);
  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    const nextZoom = Math.min(1.5, Math.max(0.45, zoom * (event.deltaY < 0 ? 1.08 : 0.92)));
    const bounds = viewport.getBoundingClientRect();
    const pointX = event.clientX - bounds.left - bounds.width / 2;
    const pointY = event.clientY - bounds.top - bounds.height / 2;
    panX = pointX - (pointX - panX) * (nextZoom / zoom);
    panY = pointY - (pointY - panY) * (nextZoom / zoom);
    zoom = nextZoom;
    render();
  }, { passive: false });

  render();
})();