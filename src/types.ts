type DocumentEntry = {
  vendorName: string;
  file: File;
};

interface ParsedProduct {
  sku_number: string;
  inventory: string;
  product_name: string;
  price: string;
  color_code: string;
  vendor_name: string;
  part_link_number: string;
  [key: string]: string;
}

type ParsedEntry = {
  vendorName: string;
  fileName: string;
  data: ParsedProduct[];
};

interface UploadCSVProps {
  onChangeStep: (step: number) => void;
}

interface ProductItem {
  vendorName: string;
  fileName: string;
  data: ParsedProduct;
}