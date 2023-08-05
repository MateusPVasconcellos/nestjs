export class RecoveryEmailEvent {
  constructor(readonly email?: string, readonly recoveryToken?: string) {}
}
