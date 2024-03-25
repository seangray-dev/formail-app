import { convertToCSV, exportToCsv, exportToJson } from "@/lib/utils";

const objArray = [
  { name: "Alice", age: "30", email: "alice@example.com" },
  { name: "Bob", age: "25", email: "bob@example.com" },
];

describe("exportToJSON", () => {
  let mockLink: HTMLAnchorElement;
  let mockClick: jest.Mock;

  beforeEach(() => {
    mockClick = jest.fn();
    mockLink = {
      setAttribute: jest.fn(),
      click: mockClick,
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, "createElement").mockReturnValue(mockLink);
    jest.spyOn(window, "encodeURIComponent").mockReturnValue("mockEncodedData");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("triggers a download with the correct data URI and default filenames", () => {
    exportToJson(objArray);
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      1,
      "href",
      "data:application/json;charset=utf-8,mockEncodedData",
    );
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      2,
      "download",
      "data.json",
    );
    expect(mockClick).toHaveBeenCalled();
  });

  it("does not trigger a download if Submission Data is falsy", () => {
    exportToJson([]);
    expect(document.createElement).not.toHaveBeenCalled();
    expect(mockLink.setAttribute).not.toHaveBeenCalled();
    expect(mockClick).not.toHaveBeenCalled();
  });

  it("uses the provided filename for the download", () => {
    exportToJson(objArray, "customFilename.json");
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      1,
      "href",
      "data:application/json;charset=utf-8,mockEncodedData",
    );
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      2,
      "download",
      "customFilename.json",
    );
    expect(mockClick).toHaveBeenCalled();
  });

  it("serializes the correct data to JSON", () => {
    const stringifySpy = jest.spyOn(JSON, "stringify");
    exportToJson(objArray);
    expect(stringifySpy).toHaveBeenCalledWith(objArray);
    stringifySpy.mockRestore();
  });
});

describe("convertToCSV", () => {
  it("returns an empty string if objArray is falsy", () => {
    expect(convertToCSV(null as any)).toBe("");
    expect(convertToCSV(undefined as any)).toBe("");
    expect(convertToCSV([])).toBe("");
  });

  it("returns a CSV string with headers and values", () => {
    const expectedCSV = `name,age,email\r\n"Alice","30","alice@example.com"\r\n"Bob","25","bob@example.com"`;
    expect(convertToCSV(objArray)).toBe(expectedCSV);
  });

  it("handles missing values by replacing them with an empty string", () => {
    const objArrayWithMissingValues = [
      { name: "Alice", age: "30" }, // Missing email
      { name: "Bob", email: "bob@example.com" }, // Missing age
    ];
    const expectedCSV = `name,age,email\r\n"Alice","30",""\r\n"Bob","","bob@example.com"`;

    expect(convertToCSV(objArrayWithMissingValues as any)).toBe(expectedCSV);
  });
});

describe("exportToCsv", () => {
  let mockLink: HTMLAnchorElement;
  let mockClick: jest.Mock;

  beforeEach(() => {
    mockClick = jest.fn();
    mockLink = {
      setAttribute: jest.fn(),
      click: mockClick,
    } as unknown as HTMLAnchorElement;

    jest.spyOn(document, "createElement").mockReturnValue(mockLink);
    jest.spyOn(window, "encodeURIComponent").mockReturnValue("mockEncodedData");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("triggers a download with the correct data URI and default filenames", () => {
    exportToCsv(objArray);
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      1,
      "href",
      "data:text/csv;charset=utf-8,mockEncodedData",
    );
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      2,
      "download",
      "data.csv",
    );
    expect(mockClick).toHaveBeenCalled();
  });

  it("does not trigger a download if selectedData is falsy", () => {
    exportToCsv([]);
    expect(document.createElement).not.toHaveBeenCalled();
    expect(mockLink.setAttribute).not.toHaveBeenCalled();
    expect(mockClick).not.toHaveBeenCalled();
  });

  it("uses the provided filename for the download", () => {
    exportToCsv(objArray, "customFilename.csv");
    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      1,
      "href",
      "data:text/csv;charset=utf-8,mockEncodedData",
    );
    expect(mockLink.setAttribute).toHaveBeenNthCalledWith(
      2,
      "download",
      "customFilename.csv",
    );
    expect(mockClick).toHaveBeenCalled();
  });
});
