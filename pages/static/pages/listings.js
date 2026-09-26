(() => {
  const page = document.querySelector("[data-listing-page]");
  if (!page) return;

  const endpoint = page.dataset.apiUrl;
  const listingType = page.dataset.listingType;
  const emptyState = page.querySelector("[data-listings-empty]");
  const results = page.querySelector("[data-listing-results]");
  const pageStatus = page.querySelector("[data-listing-status]");
  const dialog = document.querySelector("[data-listing-dialog]");
  const form = document.querySelector("[data-listing-form]");
  const formStatus = document.querySelector("[data-form-status]");
  const openButton = page.querySelector("[data-open-listing-form]");
  const submitButton = form?.querySelector('[type="submit"]');

  const csrfToken = () => form.querySelector('[name="csrfmiddlewaretoken"]').value;

  const renderListings = (listings) => {
    results.replaceChildren();
    listings.forEach((listing) => {
      const card = document.createElement("a");
      const targetUrl = listingType === "all" ? page.dataset.editUrl : page.dataset.detailUrl;
      const query = new URLSearchParams({ id: listing.id, type: listing.listing_type });
      card.href = `${targetUrl}?${query}`;
      card.className = "listing-card listing-card-link";
      const title = document.createElement("h2");
      title.textContent = listing.title;
      card.append(title);
      if (listing.price) {
        const price = document.createElement("p");
        price.className = "listing-price";
        price.textContent = `${listing.price} ₽`;
        card.append(price);
      }
      if (listing.description) {
        const description = document.createElement("p");
        description.textContent = listing.description;
        card.append(description);
      }
      results.append(card);
    });
    emptyState.hidden = listings.length > 0;
    results.hidden = listings.length === 0;
  };

  const loadListings = async () => {
    const url = new URL(endpoint, window.location.href);
    url.searchParams.set("type", listingType);
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось загрузить объявления.");
      renderListings(data.listings);
      pageStatus.hidden = true;
    } catch (error) {
      pageStatus.textContent = error.message;
      pageStatus.hidden = false;
    }
  };

  if (openButton && dialog && form) {
    openButton.addEventListener("click", () => {
      formStatus.hidden = true;
      dialog.showModal();
      form.elements.title.focus();
    });
    dialog.querySelector("[data-close-listing-form]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      formStatus.hidden = true;
      submitButton.disabled = true;
      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken(),
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Не удалось добавить объявление.");
        form.reset();
        dialog.close();
        await loadListings();
        if (data.external_api.enabled && !data.external_api.success) {
          pageStatus.textContent = "Сохранено здесь, но внешний API не ответил.";
          pageStatus.hidden = false;
        }
      } catch (error) {
        formStatus.textContent = error.message;
        formStatus.hidden = false;
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  loadListings();
})();