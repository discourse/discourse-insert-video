import Controller from "@ember/controller";
import ModalFunctionality from "discourse/mixins/modal-functionality";
import discourseComputed from "discourse-common/utils/decorators";
import { isEmpty } from "@ember/utils";
import { isVideo } from "discourse/lib/uploads";

export default Controller.extend(ModalFunctionality, {
  onShow() {
    this.setProperties({
      sources: null,
      tracks: null,
      validationMessage: null
    });
  },

  @discourseComputed("sources", "tracks")
  insertDisabled(sources, tracks) {
    let data = this.prepData();
    return !data.sources;
  },

  prepData() {
    const { sources, tracks } = this;
    let data = {};

    if (sources) {
      const srcArray = sources.split("|");

      if (!srcArray.every(isVideo)) {
        this.set("validationMessage", I18n.t(themePrefix("source_not_video")));
        return false;
      }
      data.sources = srcArray;
    }

    if (tracks) {
      const tracksArray = tracks.split("|");
      data.tracks = tracksArray;
    }

    this.set("validationMessage", null);
    return data;
  },

  sourceType(src) {
    return src.substring(src.lastIndexOf(".") + 1);
  },

  actions: {
    insert() {
      const data = this.prepData();
      let sources = "",
        tracks = "";

      const poster = this.poster ? `poster="${this.poster}"` : "";

      data.sources.forEach(src => {
        sources += `\n  <source src="${src}" type="video/${this.sourceType(
          src
        )}" />`;
      });

      const controlslist =
        settings && settings.disable_download
          ? `controlslist="nodownload" `
          : "";

      if (data.tracks) {
        data.tracks.forEach((t, i) => {
          const track = t.split(","),
            url = track[0],
            label = track[1] || "English",
            langcode = track[2] || "en",
            def = i === 0 ? "default " : "";

          tracks += `\n  <track src="${url}" label="${label}" kind="subtitles" srclang="${langcode}" ${def}/>`;
        });
      }
      let text = `<video crossorigin="anonymous" controls ${controlslist} preload="metadata" ${poster}>${sources}${tracks}\n</video>`;
      this.toolbarEvent.addText(text);

      this.send("closeModal");
    },
    cancel() {
      this.send("closeModal");
    }
  }
});
