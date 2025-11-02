import { environment } from "../../../../../../assets";


export abstract class ApiClientProvider<TClientInterface> {
  getClient(): TClientInterface {
    if (environment.useInMemoryClients) {
      return this.getInMemoryClient();
    }
    return this.getApiClient();
  }

  protected abstract getInMemoryClient(): TClientInterface;

  protected abstract getApiClient(): TClientInterface;
}
