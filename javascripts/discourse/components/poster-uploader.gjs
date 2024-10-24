import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import UppyUpload from "discourse/lib/uppy/uppy-upload";
import icon from "discourse-common/helpers/d-icon";

export default class PosterUploader extends Component {
  @tracked poster;

  uppyUpload = new UppyUpload(getOwner(this), {
    type: "image",
    id: "poster-uploader",
    uploadDone: ({ url }) => {
      this.poster = url;
      this.args.setPoster(url);
    },
  });

  get addDisabled() {
    return this.uppyUpload.uploading;
  }

  @action
  updatePoster(event) {
    this.poster = event.target.value;
    this.args.setPoster(this.poster);
  }

  <template>
    <div class="poster-uploader">
      <input
        type="text"
        name="poster-image"
        value={{this.poster}}
        {{on "input" this.updatePoster}}
      />

      <div class="simple-list-uploader">
        <label class="btn {{if this.addDisabled 'disabled'}}">
          {{icon "upload"}}
          <input
            {{didInsert this.uppyUpload.setup}}
            class="hidden-upload-field"
            type="file"
            disabled={{this.addDisabled}}
            accept="image/*"
          />
        </label>
        <ConditionalLoadingSpinner @condition={{this.addDisabled}} />
      </div>
    </div>
  </template>
}
