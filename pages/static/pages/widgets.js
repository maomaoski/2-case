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

const homeGrid = document.querySelector("[data-home-grid]");
if (homeGrid) {
  const placeholders = [...homeGrid.querySelectorAll("[data-home-placeholder]")];
  const localKeys = new Set(
    [...homeGrid.querySelectorAll("[data-home-listing-key]")].map((link) => link.dataset.homeListingKey),
  );
  const localCount = localKeys.size;

  if (localCount < 9) {
    const catalogUrl = homeGrid.dataset.catalogUrl;
    Promise.all(["rent", "buy"].map(async (dealType) => {
      const url = new URL(catalogUrl, window.location.href);
      url.searchParams.set("city", "Красноярск");
      url.searchParams.set("deal_type", dealType);
      try {
        const response = await fetch(url);
        const data = await response.json();
        return response.ok ? (data.listings || []).filter((item) => item.source !== "quart") : [];
      } catch {
        return [];
      }
    })).then((results) => {
      const externalListings = results.flat().slice(0, 9 - localCount);
      if (!externalListings.length) return;

      placeholders.forEach((placeholder) => placeholder.remove());
      externalListings.forEach((listing) => {
        const card = document.createElement("article");
        card.className = "card";
        const link = document.createElement("a");
        link.className = "card-listing";
        link.href = listing.detail_url;
        link.setAttribute("aria-label", `Открыть объявление: ${listing.title}`);
        const image = document.createElement("div");
        image.className = "card-image";
        link.append(image);
        const price = document.createElement("div");
        price.className = "card-button";
        price.setAttribute("aria-label", "Цена объявления");
        price.textContent = listing.price_rub
          ? `${Number(listing.price_rub).toLocaleString("ru-RU")} ₽`
          : "Цена не указана";
        card.append(link, price);
        homeGrid.append(card);
      });
    });
  }
}