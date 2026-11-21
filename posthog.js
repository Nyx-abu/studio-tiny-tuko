/**
 * Studio Tiny Tuko - PostHog Analytics & Client Engagement Tracking
 * Production configuration for https://studio-tiny-tuko.vercel.app
 * Project ID: 756047
 * Dashboard: https://us.posthog.com/project/756047
 */
(function () {
  const POSTHOG_KEY = 'phc_vxUcxPg8Si3tXBMQMU6WFxD8fwhwTNvSJCWyRqzi7kgh';
  const POSTHOG_HOST = 'https://us.i.posthog.com';
  const POSTHOG_PROJECT_ID = '756047';

  // Official PostHog asynchronous stub & script loader
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),e}}),o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getActiveMatchingSurveys getSurveys getNextSurveyStep".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  // Initialize PostHog
  window.posthog.init(POSTHOG_KEY, {
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
      try {
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
      } catch (err) {
        // Safe fallback
      }
    }
  });

  // Track key actions and outbound clicks once DOM is ready
  function setupTracking() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const clientName = urlParams.get('client') || urlParams.get('c') || urlParams.get('ref');

      // 1. Track Key High-Value Outbound Clicks
      document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href') || '';
        if (href.includes('discord.com') || href.includes('discord.gg')) {
          window.posthog.capture('discord_community_clicked', { target: href });
        } else if (href.includes('docs.google.com/forms')) {
          window.posthog.capture('artist_application_clicked', { target: href });
        } else if (href.includes('youtube.com')) {
          window.posthog.capture('youtube_channel_clicked', { target: href });
        } else if (href.includes('carrd.co')) {
          window.posthog.capture('carrd_portfolio_clicked', { target: href });
        }
      }, { passive: true });

      // 2. Track Scroll Depth Milestones
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
            window.posthog.capture('scroll_depth_milestone', {
              depth_percent: m,
              client: clientName || 'anonymous'
            });
          }
        });
      }, { passive: true });
    } catch (err) {
      // Safe fallback
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupTracking);
  } else {
    setupTracking();
  }
})();
