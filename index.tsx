/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { findByCodeLazy, findByPropsLazy, findComponentByCodeLazy } from "@webpack";
import { PresenceStore, Text } from "@webpack/common";
import definePlugin from "@utils/types";

const containerWrapper = findByPropsLazy("memberSinceWrapper");
const container = findByPropsLazy("memberSince");
const Section = findComponentByCodeLazy('"auto":"smooth"', ".section");

export default definePlugin({
    name: "UserStatusDisplay",
    description: "Shows the current status (Online, DND, etc.) of a user in the user popout",
    authors: [{ name: "Ron", id: 681210857337913387}],
    patches: [
        {
            find: "action:\"PRESS_APP_CONNECTION\"",
            replacement: {
                match: /#{intl::USER_PROFILE_MEMBER_SINCE}\),.{0,100}userId:(\i\.id),.{0,100}}\)}\),/,
                replace: "$&,$self.UserStatusDisplayComponent({userId:$1}),"
            }
        }
    ],

    UserStatusDisplayComponent: ErrorBoundary.wrap(({ userId }: { userId: string; }) => {
        const status = PresenceStore.getStatus(userId);
        if (!status) return null;

        const statusText = {
            online: "Online",
            idle: "Idle",
            dnd: "Do Not Disturb",
            offline: "Offline",
        }[status] || "Unknown";

        return (
            <Section heading="Current Status">
                <div className={containerWrapper.memberSinceWrapper}>
                    <div className={container.memberSince}>
                        <Text variant="text-sm/normal">
                            {statusText}
                        </Text>
                    </div>
                </div>
            </Section>
        );
    }, { noop: true }),
});
