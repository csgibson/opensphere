goog.module('os.audio.AudioManager');
goog.module.declareLegacyNamespace();

goog.require('os.defines');

const settings = goog.require('os.config.Settings');
const log = goog.require('goog.log');
const object = goog.require('goog.object');
const AudioSetting = goog.require('os.audio.AudioSetting');
const Logger = goog.requireType('goog.log.Logger');



/**
 * Manages audio sound effects for applications
 */
class AudioManager {
  /**
   * Constructor.
   */
  constructor() {
    /**
     * Whether or not we are muted
     * @type {boolean}
     * @private
     */
    this.mute_ = /** @type {boolean} */ (settings.getInstance().get(AudioSetting.MUTE, false));

    /**
     * Set of sounds
     * @type {!Object<string, string>}
     * @private
     */
    this.sounds_ = {};

    /**
     * Cache of audio objects
     * @type {Object<string, HTMLAudioElement>}
     * @private
     */
    this.cache_ = {};

    /**
     * Last played time
     * @type {Object<string, number>}
     * @private
     */
    this.lastPlayed_ = {};

    /**
     * The default sound played when a sound can not be found
     * @type {?string}
     * @private
     */
    this.default_ = null;

    this.load();
  }

  /**
   * Gets the mute value
   *
   * @return {boolean} mute
   */
  getMute() {
    return this.mute_;
  }

  /**
   * Sets the mute value
   *
   * @param {boolean} mute
   */
  setMute(mute) {
    this.mute_ = mute;
    settings.getInstance().set(AudioSetting.MUTE, this.mute_);
  }

  /**
   * Gets the sounds list
   *
   * @return {!Array<!string>} The list of sounds that can be played
   */
  getSounds() {
    return object.getKeys(this.sounds_);
  }

  /**
   * Loads sounds from settings
   *
   * @protected
   */
  load() {
    if (window.HTMLAudioElement) {
      var sets = ['sounds', 'userSounds'];

      for (var s = 0, ss = sets.length; s < ss; s++) {
        var set = /** @type {Object} */ (settings.getInstance().get([sets[s]]));

        for (var label in set) {
          var url = /** @type {string} */ (set[label]);

          if (url.indexOf('sounds/') === 0) {
            url = os.ROOT + url;
          }

          if (label.toLowerCase() == 'default') {
            this.default_ = label;
          }

          this.sounds_[label] = url;
        }
      }
    } else {
      log.warning(AudioManager.LOGGER_, 'This browser does not support audio');
    }
  }

  /**
   * Plays a given sound by label
   *
   * @param {string} label The sound to play
   * @param {number=} opt_timeBetweenPlays An optional time which must ellapse between the last play and another
   */
  play(label, opt_timeBetweenPlays) {
    if (!(label in this.sounds_)) {
      if (this.default_) {
        log.fine(AudioManager.LOGGER_,
            'Could not find sound "' + label + '" in sound list, using the default instead.');
        label = this.default_;
      } else {
        log.error(AudioManager.LOGGER_,
            'Could not find "' + label + '" in sound list and no default sound was defined.');
        return;
      }
    }

    var url = this.sounds_[label];
    var audio = null;

    if (url) {
      if (url in this.cache_) {
        audio = this.cache_[url];
      } else {
        audio = /** @type {HTMLAudioElement} */ (document.createElement('audio'));
        audio.src = url;
        this.cache_[url] = audio;
      }

      var lastPlayed = this.lastPlayed_[url] || 0;
      var now = Date.now();

      if (!this.mute_ && (opt_timeBetweenPlays === undefined || now - lastPlayed > opt_timeBetweenPlays)) {
        log.fine(AudioManager.LOGGER_, 'Playing "' + label + '" from ' + url);
        audio.play();
        this.lastPlayed_[url] = now;
      }
    }
  }

  /**
   * Adds a sound to the audio manager
   *
   * @param {!string} url
   * @param {string=} opt_label
   * @return {!string} The label that was used to add the sound
   */
  addSound(url, opt_label) {
    if (!opt_label) {
      // If a label wasn't provided, use the file name minus the extension. If we can't find that
      // portion of the file name, then just use the whole URL as the label.
      var x = url.lastIndexOf('.');
      if (x < 0) {
        x = url.length;
      }

      opt_label = url.substring(url.lastIndexOf('/') + 1, x);
    }

    // add to sounds
    this.sounds_[opt_label] = url;

    // remove cache and last played time
    delete this.cache_[url];
    delete this.lastPlayed_[url];

    // add to user sounds
    var userSounds = settings.getInstance().get(['userSounds'], {});
    userSounds[opt_label] = url;
    settings.getInstance().set(['userSounds'], userSounds);

    log.info(AudioManager.LOGGER_, 'Added sound "' + opt_label + '" from ' + url);
    return opt_label;
  }
}

goog.addSingletonGetter(AudioManager);


/**
 * @type {Logger}
 * @const
 * @private
 */
AudioManager.LOGGER_ = log.getLogger('os.audio.AudioManager');


exports = AudioManager;
