(function(l, r, a, d, o, _, g, u) {
  "use strict";
  const patches = [];
  const MsgStore = r.findByProps("_channelMessages");
  const MsgActions = r.findByProps("createMessageRecord", "updateMessageRecord");
  const RowManager = r.findByName("RowManager");
  const Dispatcher = a.FluxDispatcher;

  patches.push(d.before("dispatch", Dispatcher, ([event]) => {
    if (event.type !== "MESSAGE_UPDATE") return;
    const orig = MsgStore.get(event.channelId)?.get(event.message.id);
    if (!orig || orig.author?.bot || orig.content === event.message.content) return;

    const fakeId = `editlog-${orig.id}-${Date.now()}`;
    const fakeMsg = MsgActions.createMessageRecord({
      ...orig.toJS(),
      id: fakeId,
      content: `[edited] ${orig.content}`,
      timestamp: Date.now(),
      __vml_log: true
    });

    const channel = MsgStore._channelMessages[event.channelId];
    if (channel?._messageMap.has(fakeId)) return;
    channel._messageMap.set(fakeId, fakeMsg);
    channel._array.unshift(fakeMsg);

    Dispatcher.dispatch({ type: "MESSAGE_CREATE", message: fakeMsg, channelId: event.channelId });
  }));

  patches.push(d.after("generate", RowManager.prototype, ([row], props) => {
    if (row.rowType === 1 && row.message.__vml_log) {
      props.message.edited = "previous version";
      props.backgroundHighlight = props.backgroundHighlight ?? {};
      props.backgroundHighlight.backgroundColor = a.ReactNative.processColor("#facc1533");
      props.backgroundHighlight.gutterColor = a.ReactNative.processColor("#facc15ff");
    }
  }));

  patches.push(d.after("createMessageRecord", MsgActions, ([data], out) => {
    if (data.__vml_log) out.__vml_log = true;
  }));

  patches.push(d.after("default", r.findByName("MessageRecord", false), ([raw], inst) => {
    if (raw.__vml_log) inst.__vml_log = true;
  }));

  l.onUnload = () => patches.forEach(p => p());
  return l;
})(_, vendetta.metro, vendetta.metro.common, vendetta.patcher, vendetta.plugin, vendetta.ui.components, vendetta.ui.assets, vendetta.storage);
