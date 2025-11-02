export abstract class INetworkStatusService {
  abstract isOnline(): boolean;
  abstract showOfflineRequestError(): void;
}
