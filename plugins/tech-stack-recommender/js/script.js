document.addEventListener("DOMContentLoaded", () => {
    const projectType = document.getElementById("tsr-project-type");
    const size = document.getElementById("tsr-size");
    const interaction = document.getElementById("tsr-interaction");
    const priority = document.getElementById("tsr-priority");

    const complexity = document.getElementById("tsr-complexity");
    const frontend = document.getElementById("tsr-frontend");
    const backend = document.getElementById("tsr-backend");
    const database = document.getElementById("tsr-database");
    const hosting = document.getElementById("tsr-hosting");
    const time = document.getElementById("tsr-time");

    function updateRecommendation() {
        let score = 0;

        if (size.value === "medium") score += 1;
        if (size.value === "large") score += 2;

        if (interaction.value === "dynamic") score += 1;
        if (interaction.value === "advanced") score += 2;

        if (projectType.value === "system" || projectType.value === "mobile") score += 2;
        if (projectType.value === "ecommerce") score += 1;

        if (priority.value === "scalability" || priority.value === "security") score += 1;

        if (score <= 2) {
            complexity.textContent = "🟢 Proyecto Básico";
            time.textContent = "1 - 2 semanas";
        } else if (score <= 5) {
            complexity.textContent = "🟡 Proyecto Profesional";
            time.textContent = "3 - 5 semanas";
        } else {
            complexity.textContent = "🟣 Proyecto Empresarial";
            time.textContent = "6 - 10 semanas";
        }

        if (projectType.value === "website") {
            frontend.textContent = "HTML, CSS y JavaScript";
            backend.textContent = "WordPress";
            database.textContent = "MySQL";
            hosting.textContent = "Hosting optimizado";
        }

        if (projectType.value === "ecommerce") {
            frontend.textContent = "WordPress + WooCommerce";
            backend.textContent = "PHP / WordPress";
            database.textContent = "MySQL";
            hosting.textContent = "Hosting administrado";
        }

        if (projectType.value === "system") {
            frontend.textContent = "React";
            backend.textContent = "Laravel / Node.js";
            database.textContent = "PostgreSQL / MySQL";
            hosting.textContent = "VPS o Cloud";
        }

        if (projectType.value === "mobile") {
            frontend.textContent = "Flutter / React Native";
            backend.textContent = "Firebase / Node.js";
            database.textContent = "Firestore / PostgreSQL";
            hosting.textContent = "Cloud";
        }

        if (priority.value === "design") {
            frontend.textContent += " + UI/UX";
        }

        if (priority.value === "security") {
            backend.textContent += " + Seguridad reforzada";
        }

        if (priority.value === "scalability") {
            hosting.textContent += " escalable";
        }

        if (priority.value === "speed") {
            time.textContent = score <= 2 ? "1 semana" : time.textContent;
        }
    }

    projectType.addEventListener("change", updateRecommendation);
    size.addEventListener("change", updateRecommendation);
    interaction.addEventListener("change", updateRecommendation);
    priority.addEventListener("change", updateRecommendation);

    updateRecommendation();
});