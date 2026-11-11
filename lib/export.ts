function escapeCsvCell(value: string | number): string {
  const str = String(value ?? "");
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function escapeHtmlCell(value: string | number): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCsvFile(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const lines = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ];
  const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function downloadExcelFile(
  filename: string,
  sheetTitle: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const headerHtml = headers
    .map(
      (h) =>
        `<th style="background-color:#090580;color:#ffffff;font-weight:bold;padding:8px 12px;border:1px solid #cbd5e1;text-align:left;">${escapeHtmlCell(h)}</th>`,
    )
    .join("");

  const bodyHtml = rows
    .map(
      (row) =>
        `<tr>${row
          .map(
            (cell) =>
              `<td style="padding:6px 12px;border:1px solid #cbd5e1;">${escapeHtmlCell(cell)}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8" />
<style>body{font-family:Arial,sans-serif;font-size:12px;} table{border-collapse:collapse;width:100%;}</style>
</head>
<body>
  <h3 style="color:#090580;">${escapeHtmlCell(sheetTitle)}</h3>
  <table>
    <thead><tr>${headerHtml}</tr></thead>
    <tbody>${bodyHtml}</tbody>
  </table>
</body>
</html>`.trim();

  const blob = new Blob([`\uFEFF${html}`], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  triggerDownload(blob, filename.endsWith(".xls") ? filename : `${filename}.xls`);
}

