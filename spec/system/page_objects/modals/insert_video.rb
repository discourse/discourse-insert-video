# frozen_string_literal: true

require "#{Rails.root}/spec/system/page_objects/modals/base"

module PageObjects
  module Modals
    class InsertVideo < PageObjects::Modals::Base
      MODAL_SELECTOR = ".insert-video-modal"
      def video_source_input_field
        find(".video-sources .value-input")
      end

      def poster_input_field
        find(".video-poster .ember-text-field")
      end

      def subtitle_input_field
        find(".video-subtitles .value-input")
      end
      def click_add_video_source_button
        find(".video-sources .simple-list-uploader .btn").click
      end

      def click_add_poster_button
        find(".video-poster .simple-list-uploader .btn").click
      end

      def click_add_subtitle_button
        find(".video-subtitles .simple-list-uploader .btn").click
      end

      def click_insert_video_button
        footer.find('[data-test-id="insert-video-button"]').click
      end
    end
  end
end
