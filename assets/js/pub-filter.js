document.addEventListener("DOMContentLoaded", function () {
    const publicationSections = document.querySelectorAll(".publications");

    publicationSections.forEach(section => {
        const filters = Array.from(section.querySelectorAll(".filters .btn"));
        const publications = Array.from(section.querySelectorAll(".bibliography li"));
        const paginationContainer = section.querySelector(".publication-pagination");
        const enablePagination = section.dataset.enablePagination === "true";
        const itemsPerPage = parseInt(section.dataset.itemsPerPage || "5", 10);

        let activeFilter = "*";
        let currentPage = 1;

        function getFilteredPublications() {
            return publications.filter(publication => {
                if (activeFilter === "*") {
                    return true;
                }

                const publicationTags = (publication.dataset.tags || "")
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(Boolean);

                return publicationTags.includes(activeFilter);
            });
        }

        function renderPagination(totalItems) {
            if (!paginationContainer || !enablePagination) {
                return;
            }

            const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
            currentPage = Math.min(currentPage, totalPages);
            paginationContainer.innerHTML = "";

            if (totalPages <= 1) {
                return;
            }

            const prevButton = document.createElement("button");
            prevButton.className = "btn";
            prevButton.type = "button";
            prevButton.textContent = "Previous";
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener("click", function () {
                if (currentPage > 1) {
                    currentPage -= 1;
                    render();
                }
            });
            paginationContainer.appendChild(prevButton);

            for (let page = 1; page <= totalPages; page++) {
                const pageButton = document.createElement("button");
                pageButton.className = "btn";
                if (page === currentPage) {
                    pageButton.classList.add("active");
                }
                pageButton.type = "button";
                pageButton.textContent = String(page);
                pageButton.addEventListener("click", function () {
                    currentPage = page;
                    render();
                });
                paginationContainer.appendChild(pageButton);
            }

            const nextButton = document.createElement("button");
            nextButton.className = "btn";
            nextButton.type = "button";
            nextButton.textContent = "Next";
            nextButton.disabled = currentPage === totalPages;
            nextButton.addEventListener("click", function () {
                if (currentPage < totalPages) {
                    currentPage += 1;
                    render();
                }
            });
            paginationContainer.appendChild(nextButton);
        }

        function render() {
            const filteredPublications = getFilteredPublications();
            const startIndex = enablePagination ? (currentPage - 1) * itemsPerPage : 0;
            const endIndex = enablePagination ? startIndex + itemsPerPage : filteredPublications.length;

            publications.forEach(publication => {
                publication.style.display = "none";
            });

            filteredPublications.slice(startIndex, endIndex).forEach(publication => {
                publication.style.display = "";
            });

            renderPagination(filteredPublications.length);
        }

        filters.forEach(filter => {
            filter.addEventListener("click", function () {
                filters.forEach(button => button.classList.remove("active"));
                this.classList.add("active");
                activeFilter = this.getAttribute("data-filter") || "*";
                currentPage = 1;
                render();
            });
        });

        render();
    });
});
