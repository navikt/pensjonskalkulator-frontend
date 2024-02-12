import globalClassNames from "../../style.d";
declare const classNames: typeof globalClassNames & {
  readonly container: "container";
  readonly container__hasMobilePadding: "container__hasMobilePadding";
  readonly form: "form";
  readonly textfield: "textfield";
  readonly separator: "separator";
  readonly spacer: "spacer";
  readonly spacer__small: "spacer__small";
  readonly label: "label";
  readonly description: "description";
  readonly descriptionText: "descriptionText";
  readonly alert: "alert";
  readonly ingress: "ingress";
};
export = classNames;
