import React from 'react';

import { PREFERRED_OPTIONS, TEAM_ROLES, TeamRole } from '../components/IdeaForm/IdeaFormUtils';

export default function usePreferredSync({
  preferredPart,
  team,
  emitFieldChange,
}: {
  preferredPart: string;
  team: Record<TeamRole, number>;
  emitFieldChange: (name: string, value: string) => void;
}) {
  const preferredRoleKey = React.useMemo<TeamRole | null>(() => {
    const role = TEAM_ROLES.find(r => r.label === preferredPart);
    return role ? role.key : null;
  }, [preferredPart]);

  const [radioRenderVersion, setRadioRenderVersion] = React.useState(0);
  const syncPreferredPartRadio = React.useCallback(() => setRadioRenderVersion(v => v + 1), []);

  const previousPreferredRoleRef = React.useRef<TeamRole | null>(preferredRoleKey);
  const skipPreferredRoleSyncRef = React.useRef(false);

  const handlePreferredPartSelect = React.useCallback(
    (option: (typeof PREFERRED_OPTIONS)[number], checked: boolean) => {
      if (!checked || preferredPart === option) {
        syncPreferredPartRadio();
        return;
      }

      const nextRole = TEAM_ROLES.find(r => r.label === option)?.key ?? null;
      const prevRole = preferredRoleKey;

      let synced = false;

      if (nextRole) {
        const cur = team[nextRole] ?? 0;
        emitFieldChange(`team.${nextRole}`, String(cur + 1));
        synced = true;
      }

      if (prevRole && prevRole !== nextRole) {
        const prevCount = team[prevRole] ?? 0;
        if (prevCount > 0) {
          emitFieldChange(`team.${prevRole}`, String(Math.max(0, prevCount - 1)));
          synced = true;
        }
      }

      emitFieldChange('preferredPart', option);
      if (synced) skipPreferredRoleSyncRef.current = true;
    },
    [emitFieldChange, preferredPart, preferredRoleKey, syncPreferredPartRadio, team]
  );

  React.useEffect(() => {
    syncPreferredPartRadio();
  }, [preferredPart, syncPreferredPartRadio]);

  React.useEffect(() => {
    const updates: Array<{ key: TeamRole; value: number }> = [];
    const currentRole = preferredRoleKey;
    const previousRole = previousPreferredRoleRef.current;

    if (skipPreferredRoleSyncRef.current) {
      skipPreferredRoleSyncRef.current = false;
      previousPreferredRoleRef.current = currentRole;
      return;
    }

    if (currentRole) {
      const cur = team[currentRole] ?? 0;
      if (cur === 0) updates.push({ key: currentRole, value: 1 });
    }

    if (previousRole && previousRole !== currentRole) {
      const prev = team[previousRole] ?? 0;
      if (prev > 0) updates.push({ key: previousRole, value: Math.max(0, prev - 1) });
    }

    updates.forEach(u => emitFieldChange(`team.${u.key}`, String(u.value)));
    previousPreferredRoleRef.current = currentRole;
  });

  return { preferredRoleKey, radioRenderVersion, handlePreferredPartSelect };
}
