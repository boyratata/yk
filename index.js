(function(l, r, a, d, o, _, g, u) {
  "use strict";
  const n = [],
        c = r.findByProps("_channelMessages"),
        f = r.findByProps("sendBotMessage"),
        i = r.findByProps("updateMessageRecord", "createMessageRecord"),
        E = r.findByName("MessageRecord", !1),
        row = r.findByName("RowManager");

  n.push(d.before("dispatch", a.FluxDispatcher, ([t]) => {
    if (t.type === "MESSAGE_UPDATE") {
      const old = c.get(t.channelId)?.get(t.message.id);
      if (!old || old.author?.bot || old.content === t.message.content) return;

      const original = old.content;
      const author = old.author?.globalName || old.author?.username || "Unknown";

      f.sendBotMessage(t.channelId, `**[edited]** ${author}: ${original}`);
    }
  }));

  const m = () => n.forEach(x => x());
  return l.onUnload = m, l;
})(_, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.plugin, vendetta.ui.components, vendetta.ui.assets, vendetta.storage);
