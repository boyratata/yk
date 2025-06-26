(function (l, r, a, d, o, _, g, u) {
  "use strict";

  const patches = [];
  const MsgStore = r.findByProps("_channelMessages");
  const Dispatcher = a.FluxDispatcher;
  const { sendBotMessage } = r.findByProps("sendBotMessage");
  const { getChannel } = r.findByProps("getChannel");
  const { getGuild } = r.findByProps("getGuild");
  const { getCurrentUser } = r.findByProps("getCurrentUser");
  const selfId = getCurrentUser().id;
  const dmChannelId = Object.values(r.findByProps("getDMFromUserId")._channelDMUserId).find(c => c?.recipients?.[0] === selfId)?.id;

  patches.push(d.before("dispatch", Dispatcher, ([e]) => {
    if (e.type !== "MESSAGE_UPDATE") return;

    const original = MsgStore.get(e.channelId)?.get(e.message.id);
    if (!original || original.author?.bot || original.content === e.message.content) return;

    const chan = getChannel(e.channelId);
    const guild = getGuild(chan.guild_id);
    const location = chan.isDM()
      ? "Direct Message"
      : chan.isGroupDM
        ? "Group DM"
        : `#${chan.name} in ${guild?.name || "Unknown Server"} (${guild?.id})`;

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });

    const logMsg = [
      `📝 **Message Edited**`,
      `**Author:** ${original.author?.username} (${original.author?.id})`,
      `**Timestamp:** ${timestamp}`,
      `**Location:** ${location}`,
      ``,
      `**Before:** ${original.content}`,
      `**After:** ${e.message.content}`
    ].join("\n");

    if (dmChannelId) sendBotMessage(dmChannelId, logMsg);
  }));

  l.onUnload = () => patches.forEach(x => x());
  return l;
})(_, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.plugin, vendetta.ui.components, vendetta.ui.assets, vendetta.storage);
