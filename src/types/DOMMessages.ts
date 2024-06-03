export type DOMMessage = {
  type: "GET_DOM";
  action: string;
};

export type DOMMessageResponse = {
  title: string;
  headlines: string[];
  menu: any[];
  name: string | undefined;
  image: string | undefined | null;
};


