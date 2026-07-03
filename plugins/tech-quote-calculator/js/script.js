document.addEventListener("DOMContentLoaded", () => {
    const project = document.getElementById("tqc-project");
    const pages = document.getElementById("tqc-pages");
    const design = document.getElementById("tqc-design");
    const extras = document.querySelectorAll(".tqc-extras input");

    const totalElement = document.getElementById("tqc-total");
    const weeksElement = document.getElementById("tqc-weeks");
    const contactButton = document.querySelector(".tqc-contact");
    const resultBox = document.querySelector(".tqc-result h3");

    const modal = document.getElementById("tqc-modal");
    const closeModal = document.querySelector(".tqc-close-modal");
    const downloadPdfButton = document.getElementById("tqc-download-pdf");

    const summaryProject = document.getElementById("tqc-summary-project");
    const summaryPages = document.getElementById("tqc-summary-pages");
    const summaryDesign = document.getElementById("tqc-summary-design");
    const summaryExtras = document.getElementById("tqc-summary-extras");
    const summaryTotal = document.getElementById("tqc-summary-total");
    const summaryWeeks = document.getElementById("tqc-summary-weeks");

    let currentTotal = 0;

    function calculateTotal() {
        let total = 0;

        total += parseInt(project.value);
        total += parseInt(pages.value);
        total += parseInt(design.value);

        extras.forEach(extra => {
            if (extra.checked) {
                total += parseInt(extra.value);
            }
        });

        return total;
    }

    function getProjectLevel(total) {
        if (total < 800) {
            return "🟢 Proyecto Básico";
        }

        if (total < 1600) {
            return "🟡 Proyecto Profesional";
        }

        return "🟣 Proyecto Empresarial";
    }

    function getEstimatedWeeks(total) {
        if (total < 800) {
            return "1 - 2";
        }

        if (total < 1600) {
            return "3 - 5";
        }

        return "6 - 8";
    }

    function getSelectedExtras() {
        const selectedExtras = [];

        extras.forEach(extra => {
            if (extra.checked) {
                selectedExtras.push(extra.parentElement.textContent.trim());
            }
        });

        return selectedExtras.length > 0
            ? selectedExtras.join(", ")
            : "Sin funcionalidades adicionales";
    }

    function animateTotal(newTotal) {
        const start = currentTotal;
        const end = newTotal;
        const duration = 500;
        const startTime = performance.now();

        function update(currentTime) {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const value = Math.floor(start + (end - start) * progress);

            totalElement.textContent = value.toLocaleString("en-US");

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                totalElement.textContent = end.toLocaleString("en-US");
                currentTotal = end;
            }
        }

        requestAnimationFrame(update);
    }

    function updateQuote() {
        const total = calculateTotal();

        animateTotal(total);

        weeksElement.textContent = getEstimatedWeeks(total);
        resultBox.textContent = getProjectLevel(total);

        const selectedProject = project.options[project.selectedIndex].text;
        contactButton.textContent = `Solicitar cotización para ${selectedProject}`;
    }

    function fillModalSummary() {
        const total = calculateTotal();
        const selectedProject = project.options[project.selectedIndex].text;
        const selectedPages = pages.options[pages.selectedIndex].text;
        const selectedDesign = design.options[design.selectedIndex].text;
        const selectedWeeks = getEstimatedWeeks(total);

        summaryProject.textContent = selectedProject;
        summaryPages.textContent = selectedPages;
        summaryDesign.textContent = selectedDesign;
        summaryExtras.textContent = getSelectedExtras();
        summaryTotal.textContent = total.toLocaleString("en-US");
        summaryWeeks.textContent = selectedWeeks;
    }

    function openModal() {
        fillModalSummary();
        modal.classList.add("active");
    }

    function closeModalWindow() {
        modal.classList.remove("active");
    }

    function downloadAsPdf() {
    const total = calculateTotal();
    const selectedProject = project.options[project.selectedIndex].text;
    const selectedPages = pages.options[pages.selectedIndex].text;
    const selectedDesign = design.options[design.selectedIndex].text;
    const selectedWeeks = getEstimatedWeeks(total);
    const selectedExtras = getSelectedExtras();
    const today = new Date().toLocaleDateString("es-CR");

    const invoiceWindow = window.open("", "_blank");

    invoiceWindow.document.write(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Cotización</title>
            <style>
                body {
                    font-family: Arial, Helvetica, sans-serif;
                    background: #ffffff;
                    color: #111827;
                    margin: 0;
                    padding: 40px;
                }

                .invoice {
                    max-width: 760px;
                    margin: 0 auto;
                    border: 1px solid #e5e7eb;
                    padding: 35px;
                    border-radius: 12px;
                }

                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 3px solid #7c3aed;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }

                .invoice-header h1 {
                    margin: 0;
                    color: #7c3aed;
                    font-size: 30px;
                }

                .invoice-meta {
                    text-align: right;
                    font-size: 13px;
                    color: #4b5563;
                }

                .section-title {
                    color: #7c3aed;
                    font-size: 18px;
                    margin-bottom: 15px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 25px;
                }

                th {
                    background: #f5f3ff;
                    color: #4c1d95;
                    text-align: left;
                    padding: 12px;
                    border: 1px solid #ddd6fe;
                }

                td {
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    color: #374151;
                }

                .total-box {
                    margin-top: 20px;
                    padding: 20px;
                    background: #f5f3ff;
                    border-radius: 10px;
                    text-align: right;
                }

                .total-box span {
                    display: block;
                    color: #6b7280;
                    font-size: 14px;
                    margin-bottom: 5px;
                }

                .total-box strong {
                    color: #7c3aed;
                    font-size: 30px;
                }

                .note {
                    margin-top: 25px;
                    padding: 16px;
                    background: #fffbeb;
                    border: 1px solid #facc15;
                    color: #92400e;
                    border-radius: 10px;
                    line-height: 1.5;
                    font-size: 13px;
                }

                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #6b7280;
                }

                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }

                    body {
                        padding: 0;
                    }

                    .invoice {
                        border: none;
                        padding: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice">
                <div class="invoice-header">
                    <div>
                        <h1>Cotización</h1>
                        <p>Servicios tecnológicos y desarrollo web</p>
                    </div>

                    <div class="invoice-meta">
                        <strong>Fecha:</strong> ${today}<br>
                        <strong>Tipo:</strong> Estimación general
                    </div>
                </div>

                <h2 class="section-title">Resumen del proyecto</h2>

                <table>
                    <tr>
                        <th>Detalle</th>
                        <th>Selección</th>
                    </tr>
                    <tr>
                        <td>Tipo de proyecto</td>
                        <td>${selectedProject}</td>
                    </tr>
                    <tr>
                        <td>Cantidad de páginas o secciones</td>
                        <td>${selectedPages}</td>
                    </tr>
                    <tr>
                        <td>Nivel de diseño</td>
                        <td>${selectedDesign}</td>
                    </tr>
                    <tr>
                        <td>Funcionalidades adicionales</td>
                        <td>${selectedExtras}</td>
                    </tr>
                    <tr>
                        <td>Tiempo estimado</td>
                        <td>${selectedWeeks} semanas</td>
                    </tr>
                </table>

                <div class="total-box">
                    <span>Costo estimado</span>
                    <strong>$${total.toLocaleString("en-US")} USD</strong>
                </div>

                <div class="note">
                    Esta cotización es únicamente una estimación general basada en los datos seleccionados.
                    El costo final puede variar según los requerimientos específicos del proyecto.
                    Para recibir una propuesta personalizada y ajustada a sus necesidades, se recomienda contactar directamente con el equipo.
                </div>

                <div class="footer">
                    Documento generado automáticamente desde la calculadora de cotización web.
                </div>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                };
            </script>
        </body>
        </html>
    `);

    invoiceWindow.document.close();
}

    project.addEventListener("change", updateQuote);
    pages.addEventListener("change", updateQuote);
    design.addEventListener("change", updateQuote);

    extras.forEach(extra => {
        extra.addEventListener("change", updateQuote);
    });

    contactButton.addEventListener("click", openModal);
    closeModal.addEventListener("click", closeModalWindow);
    downloadPdfButton.addEventListener("click", downloadAsPdf);

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModalWindow();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModalWindow();
        }
    });

    updateQuote();
});