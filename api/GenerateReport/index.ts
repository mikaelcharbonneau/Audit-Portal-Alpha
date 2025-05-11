import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, _req: HttpRequest): Promise<void> {
  context.res = {
    status: 200,
    body: "Report generation not implemented yet"
  };
};

export default httpTrigger;
