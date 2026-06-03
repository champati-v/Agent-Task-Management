import csv from "csv-parser";
import XLSX from "xlsx";
import { Readable } from "stream";

const REQUIRED_COLUMNS = ["FirstName", "Phone", "Notes"];

const normalizeHeaders = (headers = []) => headers.map((header) => String(header).trim());

const getMissingColumns = (headers) =>
  REQUIRED_COLUMNS.filter((column) => !headers.includes(column));

const parseCsvBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    const rows = [];
    let headers = [];

    Readable.from(buffer.toString("utf8"))
      .pipe(csv())
      .on("headers", (parsedHeaders) => {
        headers = normalizeHeaders(parsedHeaders);
      })
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve({ headers, rows }))
      .on("error", reject);
  });

const parseExcelBuffer = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheetName = workbook.SheetNames[0];

  if (!firstSheetName) {
    return { headers: [], rows: [] };
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const sheetRows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  if (!sheetRows.length) {
    return { headers: [], rows: [] };
  }

  const headers = normalizeHeaders(sheetRows[0]);
  const rows = sheetRows.slice(1).map((row) => {
    const rowObject = {};

    headers.forEach((header, index) => {
      rowObject[header] = row[index] ?? "";
    });

    return rowObject;
  });

  return { headers, rows };
};

export const parseUploadedFile = async (file) => {
  const extension = file.originalname.split(".").pop()?.toLowerCase();
  const parser =
    extension === "csv" ? parseCsvBuffer : ["xls", "xlsx"].includes(extension) ? parseExcelBuffer : null;

  if (!parser) {
    throw new Error("Invalid file type");
  }

  const { headers, rows } = await parser(file.buffer);
  const missingColumns = getMissingColumns(headers);

  if (missingColumns.length) {
    throw new Error(`Missing required columns: ${missingColumns.join(", ")}`);
  }

  const records = rows
    .map((row) => ({
      firstName: String(row.FirstName ?? "").trim(),
      phone: String(row.Phone ?? "").trim(),
      notes: String(row.Notes ?? "").trim(),
    }))
    .filter((row) => row.firstName || row.phone || row.notes);

  if (!records.length) {
    throw new Error("No valid records found in file");
  }

  const invalidRowIndex = records.findIndex((row) => !row.firstName || !row.phone);

  if (invalidRowIndex !== -1) {
    throw new Error(`Row ${invalidRowIndex + 2} is missing FirstName or Phone`);
  }

  return records;
};
