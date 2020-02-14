import { withPluginApi } from "discourse/lib/plugin-api";
import showModal from "discourse/lib/show-modal";

export default {
  name: "insert-video",

  initialize() {
    withPluginApi("0.8.31", api => {
      api.onToolbarCreate(toolbar => {
        let currentUser = api.getCurrentUser();

        if (settings.only_available_to_staff && !currentUser.staff) {
          return;
        }

        toolbar.addButton({
          title: themePrefix("composer_title"),
          id: "insertVideo",
          group: "fontStyles",
          icon: "video",
          perform: e =>
            showModal("insert-video").setProperties({ toolbarEvent: e })
        });
      });
    });
  }
};
