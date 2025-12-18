import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { OfflineSession } from './offline-session.model';

const OFFLINE_SESSION_KEY = 'offline_session';

@Injectable({ providedIn: 'root' })
export class OfflineSessionService {
  async save(session: OfflineSession): Promise<void> {
    await Preferences.set({
      key: OFFLINE_SESSION_KEY,
      value: JSON.stringify(session),
    });
  }

  async load(): Promise<OfflineSession | null> {
    const { value } = await Preferences.get({ key: OFFLINE_SESSION_KEY });
    return value ? (JSON.parse(value) as OfflineSession) : null;
  }

  async exists(): Promise<boolean> {
    const { value } = await Preferences.get({ key: OFFLINE_SESSION_KEY });
    return !!value;
  }

  async clear(): Promise<void> {
    await Preferences.remove({ key: OFFLINE_SESSION_KEY });
  }
}
