import globalClassNames from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly spacer: "spacer";
  readonly label: "label";
  readonly textfield: "textfield";
  readonly paragraph: "paragraph";
  readonly button: "button";
};
export = classNames;
