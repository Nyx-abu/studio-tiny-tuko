/**
 * Studio Tiny Tuko - PostHog Analytics & Client Engagement Tracking
 * Production configuration for https://studio-tiny-tuko.vercel.app
 */
(function () {
  const POSTHOG_KEY = 'phc_vxUcxPg8Si3tXBMQMU6WFxD8fwhwTNvSJCWyRqzi7kgh';
  const POSTHOG_HOST = 'https://us.i.posthog.com';

  // Initialize PostHog queue stub
  var posthog = window.posthog = window.posthog || [];
  if (!posthog.__SV) {
    posthog._i = [];
    posthog.init = function (token, config, name) {
      function createStub(obj, method) {
        var parts = method.split('.');
        if (parts.length === 2) {
          obj = obj[parts[0]];
          method = parts[1];
        }
        obj[method] = function () {
          obj.push([method].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      var target = posthog;
      if (name) {
        posthog[name] = posthog[name] || [];
        target = posthog[name];
      }
      var methods = [
        'capture', 'identify', 'alias', 'people.set', 'people.set_once', 'set_config',
        'register', 'register_once', 'unregister', 'opt_in_capturing', 'opt_out_capturing',
        'has_opted_in_capturing', 'has_opted_out_capturing', 'clear_opt_in_out_capturing',
        'reset', 'isFeatureEnabled', 'onFeatureFlags', 'reloadFeatureFlags', 'group',
        'updateEarlyAccessFeatureEnrollment', 'getEarlyAccessFeatures', 'getActiveMatchingSurveys',
        'renderSurvey', 'canRenderSurvey', 'getSurveys'
      ];
      for (var i = 0; i < methods.length; i++) {
        createStub(target, methods[i]);
      }
      posthog._i.push([token, config, name]);
    };
    posthog.__SV = 1;

    // Load official array.js from PostHog CDN
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = 'https://us-assets.i.posthog.com/static/array.js';
    var firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  // Initialize PostHog Client
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'always',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: false,
    },
    loaded: function (ph) {
      // 1. Client Detection & Instant Attribution
      // Check for ?client=Acme or ?c=Acme or ?ref=pitch in URL
      const urlParams = new URLSearchParams(window.location.search);
      const clientName = urlParams.get('client') || urlParams.get('c') || urlParams.get('ref');

      if (clientName) {
        ph.identify(clientName, {
          client_name: clientName,
          first_opened_at: new Date().toISOString(),
          landing_url: window.location.href,
          referrer: document.referrer || 'direct'
        });
        ph.capture('client_opened_pitch', {
          client: clientName,
          url: window.location.href,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        });
      } else {
        ph.capture('show_bible_opened', {
          url: window.location.href,
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString()
        });
      }

      // 2. Track Key High-Value Outbound Clicks
      document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href') || '';
        if (href.includes('discord.com') || href.includes('discord.gg')) {
          ph.capture('discord_community_clicked', { target: href });
        } else if (href.includes('docs.google.com/forms')) {
          ph.capture('artist_application_clicked', { target: href });
        } else if (href.includes('youtube.com')) {
          ph.capture('youtube_channel_clicked', { target: href });
        } else if (href.includes('carrd.co')) {
          ph.capture('carrd_portfolio_clicked', { target: href });
        }
      }, { passive: true });

      // 3. Track Scroll Depth Milestones
      const scrollMilestones = [25, 50, 75, 90, 100];
      const reachedMilestones = new Set();

      window.addEventListener('scroll', function () {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight <= 0) return;

        const scrollPercent = Math.min(100, Math.round((scrollTop / docHeight) * 100));

        scrollMilestones.forEach(function (m) {
          if (scrollPercent >= m && !reachedMilestones.has(m)) {
            reachedMilestones.add(m);
            ph.capture('scroll_depth_milestone', {
              depth_percent: m,
              client: clientName || 'anonymous'
            });
          }
        });
      }, { passive: true });
    }
  });
})();
