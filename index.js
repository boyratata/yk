(function(l, r, a, d, o, _, g, u) {
  "use strict";
  const n = [], 
        c = r.findByProps("_channelMessages"), 
        i = r.findByProps("updateMessageRecord", "createMessageRecord"), 
        E = r.findByName("MessageRecord", !1), 
        f = r.findByName("RowManager");

  n.push(d.before("dispatch", a.FluxDispatcher, ([t]) => {
    if (t.type === "MESSAGE_UPDATE") {
      const original = c.get(t.channelId)?.get(t.message.id);
      if (!original) return;
      if (original.author?.bot) return;
      if (original.content === t.message.content) return;

      const fakeId = `editlog-${original.id}-${Date.now()}`;
      const clone = {
        ...original.toJS(),
        id: fakeId,
        content: `[edited] ${original.content}`,
        __vml_log: !0
      };

      a.FluxDispatcher.dispatch({
        type: "MESSAGE_CREATE",
        message: clone,
        channelId: t.channelId
      });
    }
  }));

  n.push(d.after("generate", f.prototype, ([t], e) => {
    if (t.rowType === 1 && t.message.__vml_log) {
      e.message.edited = "previous version";
      e.backgroundHighlight ??= {};
      e.backgroundHighlight.backgroundColor = a.ReactNative.processColor("#facc1533");
      e.backgroundHighlight.gutterColor = a.ReactNative.processColor("#facc15ff");
    }
  }));

  n.push(d.after("createMessageRecord", i, function([t], e) {
    if (t.__vml_log) e.__vml_log = !0;
  }));
  n.push(d.after("default", E, ([t], e) => {
    e.__vml_log = !!t.__vml_log;
  }));

  const m = () => n.forEach(t => t());
  return l.onUnload = m, l;
})(_, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.plugin, vendetta.ui.components, vendetta.ui.assets, vendetta.storage);
