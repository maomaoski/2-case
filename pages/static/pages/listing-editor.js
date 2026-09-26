(() => {
  const page = document.querySelector("[data-listing-editor]");
  if (!page) return;

  const form = page.querySelector("[data-editor-form]");
  const photoInput = form.querySelector("[data-photo-input]");
  const photoList = form.querySelector("[data-photo-list]");
  const status = form.querySelector("[data-editor-status]");
  const submit = form.querySelector('[type="submit"]');
  const removedPhotos = new Set();
  const csrfToken = form.querySelector('[name="csrfmiddlewaretoken"]').value;

  const renderNewPhotos = () => {
    photoList.querySelectorAll("[data-new-photo]").forEach((item) => item.remove());
    [...photoInput.files].forEach((file, index) => {
      const item = document.createElement("div");
      item.className = "photo-item";
      item.dataset.newPhoto = "";
      const image = document.createElement("img");
      image.alt = file.name;
      image.src = URL.createObjectURL(file);
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-photo";
      remove.setAttribute("aria-label", "Убрать фотографию");
      remove.textContent = "×";
      remove.addEventListener("click", () => {
        const transfer = new DataTransfer();
        [...photoInput.files].forEach((currentFile, fileIndex) => {
          if (fileIndex !== index) transfer.items.add(currentFile);
        });
        photoInput.files = transfer.files;
        renderNewPhotos();
      });
      item.append(image, remove);
      photoList.insertBefore(item, photoList.querySelector(".photo-add"));
    });
  };

  photoInput.addEventListener("change", renderNewPhotos);
  photoList.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove-photo]");
    if (!remove) return;
    const item = remove.closest("[data-existing-photo]");
    if (!item) return;
    removedPhotos.add(item.dataset.photoId);
    item.remove();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.hidden = true;
    submit.disabled = true;
    const formData = new FormData(form);
    removedPhotos.forEach((id) => formData.append("remove_photos", id));
    const detailUrl = page.dataset.detailUrl;
    try {
      const response = await fetch(detailUrl || page.dataset.collectionUrl, {
        method: "POST",
        headers: { "X-CSRFToken": csrfToken },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось сохранить анкету.");
      window.location.assign(page.dataset.returnUrl);
    } catch (error) {
      status.textContent = error.message;
      status.hidden = false;
    } finally {
      submit.disabled = false;
    }
  });
})();