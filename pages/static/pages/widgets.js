document.querySelectorAll("[data-picker]").forEach((picker) => {
  const trigger = picker.querySelector("[data-picker-trigger]");
  const panel = picker.querySelector("[data-picker-panel]");
  const search = picker.querySelector("[data-picker-search]");
  const options = [...picker.querySelectorAll(".picker-option")];
  const emptyMessage = picker.querySelector("[data-picker-empty]");

  const close = () => {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  };

  trigger.addEventListener("click", () => {
    const isOpen = !panel.hidden;
    panel.hidden = isOpen;
    trigger.setAttribute("aria-expanded", String(!isOpen));
    if (!isOpen) search.focus();
  });

  search.addEventListener("input", () => {
    const query = search.value.trim().toLocaleLowerCase("ru");
    let visibleCount = 0;

    options.forEach((option) => {
      const matches = option.textContent.trim().toLocaleLowerCase("ru").includes(query);
      option.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    emptyMessage.hidden = visibleCount > 0;
  });

  picker.addEventListener("change", (event) => {
    if (event.target.matches('input[type="radio"]')) {
      trigger.querySelector("span:nth-child(2)").textContent = event.target.nextElementSibling.textContent;
      close();
    }
  });

  document.addEventListener("click", (event) => {
    if (!picker.contains(event.target)) close();
  });

  picker.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
      trigger.focus();
    }
  });
});