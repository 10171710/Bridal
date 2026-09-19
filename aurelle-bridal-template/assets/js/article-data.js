/* ==========================================================================
   AURELLE — article-data.js
   Full article content database for the Aurelle Bridal Journal.
   Supports dynamic client-side article navigation on blog-details.html.
   ========================================================================== */
window.AURELLE_ARTICLES = [
  {
    slug: "90-day-skin-countdown",
    id: 1,
    title: "The 90-Day Skin Countdown Every Bride Should Start Today",
    category: "skin-prep",
    categoryName: "Skin Prep",
    date: "04 Sep 2026",
    readTime: "4 min read",
    author: "Nadia Sethi",
    authorRole: "Founder & Lead Artist",
    authorBio: "Styling over 1,240 brides across 14 years. Nadia leads the Aurelle masterclass on bridal skin prep and photo-ready finishes.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/bridal-skincare-countdown-calendar.jpg",
    imageAlt: "Bride preparing skin with 90-day countdown calendar and morning vanity care",
    lead: "A curated timeline from 90 days out to wedding morning — plus the critical cutoff window.",
    phClass: "ph-blog",
    icon: "bi-droplet",
    tags: ["Skin Prep", "Retinol", "Patch Test", "Wedding Timeline"],
    body: `
      <p class="lead">Luminous wedding-day makeup begins with skin physiology, not last-minute foundation coverage. Because skin requires 28 to 40 days for a complete cellular renewal cycle, a 90-day runway gives you two to three renewal cycles to safely test actives, correct concerns, and build deep hydration margins.</p>

      <h2>The 90-Day Bridal Skin Timeline</h2>
      <p>Follow these six curated milestones to arrive at your wedding morning with a calm, supple, and radiant canvas:</p>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">90 Days Out — Establish Your Baseline</h3>
          <span class="checkpoint-badge"><i class="bi bi-calendar-check" aria-hidden="true"></i> Month 1</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Consult a professional:</strong> Book an initial assessment with an esthetician or dermatologist to map your skin type, barriers, and sensitivities.</li>
          <li><strong>Daily SPF 30+:</strong> Start broad-spectrum sun protection daily — the single most effective step for clear, even tone in photography.</li>
          <li><strong>Simplify essentials:</strong> Switch to a gentle, fragrance-free cleanser, hydrating essence, and barrier-repair moisturizer.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">60 Days Out — Introduce Active Treatments</h3>
          <span class="checkpoint-badge"><i class="bi bi-stars" aria-hidden="true"></i> Month 2</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Targeted actives:</strong> Introduce gentle retinoids 2 nights a week (always patch-test 48 hours first on inner forearm).</li>
          <li><strong>Morning antioxidant:</strong> Layer Vitamin C serum under sunscreen for brightening and collagen stimulation.</li>
          <li><strong>Mild exfoliation:</strong> Use a gentle AHA/BHA or lactic acid peel once weekly on non-retinol evenings.</li>
          <li><strong>Internal hydration:</strong> Increase daily water intake to 2.5L and prioritize 7+ hours of quality sleep.</li>
        </ul>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">30 Days Out — Final In-Clinic Treatment Window</h3>
          <span class="checkpoint-badge"><i class="bi bi-clock-history" aria-hidden="true"></i> Month 3</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Last intensive facial:</strong> Complete any chemical peels, laser sessions, or microneedling at this checkpoint.</li>
          <li><strong>Shift to maintenance:</strong> Transition your regimen completely from active correction to deep barrier hydration.</li>
        </ul>
      </div>

      <div class="alert-au alert-warn-au my-4">
        <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        <div>
          <strong>The 3-Week Golden Rule:</strong> Never book first-time peels, new lasers, unfamiliar brands, or aggressive facial extractions inside three weeks of your wedding date. If a reaction occurs, three weeks is rarely enough time to fully recover before the big day.
        </div>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">14 Days Out — Consistency & Protection</h3>
          <span class="checkpoint-badge"><i class="bi bi-shield-check" aria-hidden="true"></i> 2 Weeks Out</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Lock your routine:</strong> Zero new products, masks, or laundry detergents from here forward.</li>
          <li><strong>Complimentary patch test:</strong> Attend your scheduled Aurelle patch test to verify makeup and mehendi formulation comfort.</li>
          <li><strong>Consistent sun protection:</strong> Prevent uneven tan lines or sudden sensitivity with continuous SPF and sun avoidance.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">7 Days Out — Dress Rehearsal & Plumping</h3>
          <span class="checkpoint-badge"><i class="bi bi-sparkles" aria-hidden="true"></i> 1 Week Out</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Final trial prep:</strong> Bring your tested skincare products to your final trial so makeup adheres seamlessly.</li>
          <li><strong>Hydrating sheet masks:</strong> Use gentle hyaluronic acid sheet masks 2–3 times this week for photo plumpness.</li>
          <li><strong>Dietary moderation:</strong> Moderate high-sodium foods and alcohol to prevent morning fluid retention.</li>
        </ul>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">1 Day Out — Wedding Eve Serenity</h3>
          <span class="checkpoint-badge"><i class="bi bi-moon-stars" aria-hidden="true"></i> Wedding Eve</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Keep it simple:</strong> Cleanse, apply familiar moisturizer, and get early restorative rest.</li>
          <li><strong>Depuffing tools:</strong> Keep chilled eye masks or facial ice globes ready in the mini-fridge.</li>
          <li><strong>Morning glow:</strong> Wake refreshed — our artistry team handles the rest in the bridal suite!</li>
        </ul>
      </div>

      <h2>Quick Guide by Skin Type</h2>
      <p>Focus your countdown based on your skin's unique profile:</p>

      <div class="skin-grid">
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-droplet-half" aria-hidden="true"></i> Oily &amp; Combination</div>
          <p>Introduce actives at day 60 slowly; zone treatment with lightweight non-comedogenic hydration on the T-zone.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-flower1" aria-hidden="true"></i> Dry &amp; Dehydrated</div>
          <p>Layer ceramide moisturizers and hydrating essences; barrier nourishment creates a smooth canvas for bridal makeup.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-heart-pulse" aria-hidden="true"></i> Sensitive &amp; Reactive</div>
          <p>Extend patch tests to a full week; avoid fragrances and treat the 3-week treatment cutoff as a strict 4-week rule.</p>
        </div>
      </div>
    `
  },
  {
    slug: "patch-testing-101",
    id: 2,
    title: "Patch Testing 101: The Two-Week Rule That Saves Reactive Skin",
    category: "skin-prep",
    categoryName: "Skin Prep",
    date: "10 Jul 2026",
    readTime: "4 min read",
    author: "Elena Duarte",
    authorRole: "Colour & Skin Specialist",
    authorBio: "Elena specializes in dermatological prep, shade calibration, and sensitive-skin formulation compatibility.",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/skincare-patch-testing-consultation.jpg",
    imageAlt: "Dermatologist conducting a clinical patch test consultation for sensitive bridal skin",
    lead: "One overlooked test prevents almost every wedding-week breakout and contact dermatitis flare in the chair.",
    phClass: "ph-blog",
    icon: "bi-eyedropper",
    tags: ["Patch Test", "Sensitive Skin", "Skin Prep", "Allergy Advice"],
    body: `
      <p class="lead">Contact dermatitis and sudden allergic flare-ups are every bride's worst fear. Yet over 80% of wedding-week skin emergencies stem from a single untested product introduced within the final month.</p>

      <h2>The Two-Phase Patch Testing Protocol</h2>
      <p>A true patch test requires time for delayed hypersensitivity (Type IV allergic reaction) to manifest. Here is the clinical testing standard we follow:</p>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Phase 1: Inner Forearm Test (48 Hours)</h3>
          <span class="checkpoint-badge">Step 1</span>
        </div>
        <ul class="checkpoint-list">
          <li>Apply a pea-sized amount of product to the clean, dry inner forearm.</li>
          <li>Leave on for 24–48 hours without washing or layering other products.</li>
          <li>Check for redness, itching, burning, or tiny papules.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Phase 2: Jawline / Behind Ear Test (72 Hours)</h3>
          <span class="checkpoint-badge">Step 2</span>
        </div>
        <ul class="checkpoint-list">
          <li>Facial skin contains different sebaceous and barrier properties than body skin.</li>
          <li>Apply product just beneath the jawline or behind the lower earlobe for 3 consecutive nights.</li>
          <li>Monitor for pore congestion, milia, or texture irritation under natural light.</li>
        </ul>
      </div>

      <div class="alert-au alert-warn-au my-4">
        <i class="bi bi-shield-exclamation" aria-hidden="true"></i>
        <div>
          <strong>Always Test Henna & Hair Colour:</strong> PPD (paraphenylenediamine) sensitivity can cause severe swelling. Aurelle uses 100% organic, PPD-free henna and schedules patch tests two weeks before every booking.
        </div>
      </div>

      <h2>What To Do If a Reaction Occurs</h2>
      <div class="skin-grid">
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-x-circle" aria-hidden="true"></i> Stop Immediately</div>
          <p>Rinse with cool water, cease all active ingredients (retinoids, AHA, vitamin C), and strip back to pure barrier balm.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-thermometer-half" aria-hidden="true"></i> Soothe Inflammation</div>
          <p>Apply over-the-counter 1% hydrocortisone cream sparingly for 48 hours, or pure thermal spring water compresses.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-chat-heart" aria-hidden="true"></i> Alert Your Artist</div>
          <p>Notify our team immediately so Elena can formulate a hypoallergenic, fragrance-free makeup kit for your trial.</p>
        </div>
      </div>
    `
  },
  {
    slug: "airbrush-or-hd",
    id: 3,
    title: "Airbrush or HD? An Honest Comparison Minus the Sales Pitch",
    category: "makeup",
    categoryName: "Makeup",
    date: "22 Aug 2026",
    readTime: "5 min read",
    author: "Nadia Sethi",
    authorRole: "Founder & Lead Artist",
    authorBio: "Styling over 1,240 brides across 14 years. Nadia leads the Aurelle masterclass on bridal skin prep and photo-ready finishes.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/airbrush-vs-hd-bridal-makeup.jpg",
    imageAlt: "Airbrush vs HD bridal makeup side-by-side comparison on model",
    lead: "Which finish photographs better, which lasts longer, and which truly suits textured or mature skin.",
    phClass: "ph-makeup",
    icon: "bi-palette2",
    tags: ["Airbrush", "HD Makeup", "Bridal Foundation", "Longevity"],
    body: `
      <p class="lead">Bridal beauty forums are filled with debate over Airbrush versus Traditional HD makeup. The truth is neither is universally superior — your skin texture, climate, and photographic lighting dictate the perfect choice.</p>

      <h2>The Technical Differences</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Airbrush Makeup: The Micro-Mist Veil</h3>
          <span class="checkpoint-badge">Airbrush Technique</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Application:</strong> Silicone-based formula atomized with compressed air into micro-droplets.</li>
          <li><strong>Best For:</strong> Normal to oily skin, hot/humid outdoor ceremonies, and high water-resistance.</li>
          <li><strong>Finish:</strong> Weightless, pore-diffusing satin finish that resists transfer during hugs and ceremonies.</li>
          <li><strong>Watch-out:</strong> Can cling to dry patches or peach fuzz if skin is not exfoliated and hydrated.</li>
        </ul>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">High-Definition (HD) Makeup: Cream & Fluid Mastery</h3>
          <span class="checkpoint-badge">HD Technique</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Application:</strong> Light-scattering pigment pigments buffed and pressed into the skin using brush and sponge.</li>
          <li><strong>Best For:</strong> Dry, textured, mature, or acne-prone skin requiring customizable spot coverage.</li>
          <li><strong>Finish:</strong> Skin-like radiance and buildable dewiness that stays flexible and blendable all day.</li>
          <li><strong>Watch-out:</strong> Requires precise setting in high heat to prevent oil breakthrough in the T-zone.</li>
        </ul>
      </div>

      <h2>At-a-Glance Comparison Matrix</h2>
      <div class="skin-grid">
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-camera" aria-hidden="true"></i> Flash Photography</div>
          <p>Both render flawlessly when formulated without zinc/titanium flashback. Airbrush gives soft-focus blur; HD gives dimensional glow.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-sun" aria-hidden="true"></i> Tear &amp; Heat Endurance</div>
          <p>Airbrush silicone base locks tears into place. HD can be touched up seamlessly with translucent powder.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-brush" aria-hidden="true"></i> The Aurelle Recommendation</div>
          <p>We test both side-by-side during your consultation to see how each formula sits on your natural skin texture.</p>
        </div>
      </div>
    `
  },
  {
    slug: "waterproof-formulas",
    id: 4,
    title: "Waterproof Formulas That Actually Survive a Summer Ceremony",
    category: "makeup",
    categoryName: "Makeup",
    date: "14 Jun 2026",
    readTime: "6 min read",
    author: "Elena Duarte",
    authorRole: "Colour & Skin Specialist",
    authorBio: "Elena specializes in dermatological prep, shade calibration, and sensitive-skin formulation compatibility.",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/outdoor-summer-ceremony-bride.jpg",
    imageAlt: "Smiling outdoor bride in lace gown with floral bouquet and arch",
    lead: "What we pack for outdoor August weddings, and the three products we never skip.",
    phClass: "ph-makeup",
    icon: "bi-droplet-half",
    tags: ["Waterproof", "Longwear", "Summer Wedding", "Bridal Makeup"],
    body: `
      <p class="lead">An August outdoor ceremony with 85°F weather, direct sunlight, and emotional vows will melt conventional cosmetics within two hours. Here is the exact longwear architecture we use.</p>

      <h2>The 3 Pillars of Weather-Proof Bridal Makeup</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">1. Primer Architecture: The Grip Layer</h3>
          <span class="checkpoint-badge">Pillar 1</span>
        </div>
        <ul class="checkpoint-list">
          <li>We avoid heavy silicone primers that create a slippery film in high temperatures.</li>
          <li>Instead, we use water-based, grip polymer primers that chemically bond to moisturized skin.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">2. Waterproof Eye Construction</h3>
          <span class="checkpoint-badge">Pillar 2</span>
        </div>
        <ul class="checkpoint-list">
          <li>Tubing and polymer-gel liners that dry down transfer-proof against happy tears.</li>
          <li>Water-resistant latex lash adhesive layered with sealed individual lash clusters.</li>
        </ul>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">3. The 3-Stage Setting Mist Sandwich</h3>
          <span class="checkpoint-badge">Pillar 3</span>
        </div>
        <ul class="checkpoint-list">
          <li>Stage 1: Setting mist over foundation base before cream contour.</li>
          <li>Stage 2: Translucent micro-powder press into sweat-prone zones.</li>
          <li>Stage 3: Final film-forming acrylic setting spray lock.</li>
        </ul>
      </div>
    `
  },
  {
    slug: "updo-half-up-or-down",
    id: 5,
    title: "Updo, Half-Up or Down: Choosing Hair by Venue and Veil",
    category: "hair",
    categoryName: "Hair",
    date: "30 Jul 2026",
    readTime: "6 min read",
    author: "Maya Lin",
    authorRole: "Hairstylist & Veil Drape Specialist",
    authorBio: "Maya is renowned for architectural updos, romantic waves, and effortless weightless veil pinning.",
    authorAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/bridal-hair-and-veil-silhouettes.jpg",
    imageAlt: "Bridal hair and veil silhouette guide showing chignons, waves, and veils",
    lead: "Beach, ballroom or garden — how the venue and veil length should decide the silhouette.",
    phClass: "ph-hair",
    icon: "bi-scissors",
    tags: ["Hairstyle", "Updo", "Veil", "Venue Selection"],
    body: `
      <p class="lead">Choosing your bridal hairstyle without factoring in your neckline, veil weight, and ceremony weather is the most common styling misstep we encounter in consultations.</p>

      <h2>Silhouette Selection Guide</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">The Sculpted Updo / Low Chignon</h3>
          <span class="checkpoint-badge">Best for Drama & Longevity</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Best For:</strong> High necklines, intricate back details, cathedral veils, and warm climates.</li>
          <li><strong>Advantage:</strong> Zero hair tangling on beaded lehengas; holds pristine shape for 14+ hours.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Half-Up Romantic Braids & Curls</h3>
          <span class="checkpoint-badge">Best of Both Worlds</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Best For:</strong> Sweetheart and strapless necklines, floral crowns, and garden settings.</li>
          <li><strong>Advantage:</strong> Frames the collarbones while keeping hair pinned safely away from the eyes and lips.</li>
        </ul>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Hollywood Waves / Flowing Glamour</h3>
          <span class="checkpoint-badge">Editorial Elegance</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Best For:</strong> Modern editorial gowns, indoor ballroom lighting, and shorter ceremony timelines.</li>
          <li><strong>Advantage:</strong> Luxurious movement and high-gloss shine in bridal portraits.</li>
        </ul>
      </div>
    `
  },
  {
    slug: "humidity-proofing-hair",
    id: 6,
    title: "Humidity-Proofing Your Bridal Hairstyle for Outdoor Vows",
    category: "hair",
    categoryName: "Hair",
    date: "18 May 2026",
    readTime: "5 min read",
    author: "Maya Lin",
    authorRole: "Hairstylist & Veil Drape Specialist",
    authorBio: "Maya is renowned for architectural updos, romantic waves, and effortless weightless veil pinning.",
    authorAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/humidity-proofing-bridal-hair.jpg",
    imageAlt: "Bridal hairstylist applying fine-mist setting spray to textured braided chignon",
    lead: "The wash-day rule, the products we trust in 90% humidity, and what to skip entirely.",
    phClass: "ph-hair",
    icon: "bi-wind",
    tags: ["Hair Prep", "Humidity", "Outdoor Wedding", "Hairspray"],
    body: `
      <p class="lead">High humidity causes moisture to penetrate the hair shaft, breaking hydrogen bonds and transforming crisp waves into frizz. Here is how we build an impenetrable moisture barrier.</p>

      <h2>The Anti-Humidity Playbook</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">1. The Night-Before Wash Rule</h3>
          <span class="checkpoint-badge">Rule 1</span>
        </div>
        <ul class="checkpoint-list">
          <li>Never wash hair the morning of the wedding. Squeaky-clean hair lacks the grit needed for hold.</li>
          <li>Wash with clarifying shampoo the evening before and rough-dry 100% without heavy oils.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">2. Thermal Polymer Sealing</h3>
          <span class="checkpoint-badge">Rule 2</span>
        </div>
        <ul class="checkpoint-list">
          <li>We coat sections in heat-activated anti-humidity sealants before styling tools touch the hair.</li>
          <li>This creates a hydrophobic shield that repels moisture in damp air.</li>
        </ul>
      </div>
    `
  },
  {
    slug: "reading-mehendi-design",
    id: 7,
    title: "Reading a Mehendi Design: Motifs and What They Mean",
    category: "mehendi",
    categoryName: "Mehendi",
    date: "25 Apr 2026",
    readTime: "6 min read",
    author: "Zara Qureshi",
    authorRole: "Master Mehendi & Henna Artist",
    authorBio: "Zara creates bespoke organic Rajasthani, Marwari, Arabic, and minimalist modern henna compositions.",
    authorAvatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/reading-bridal-mehendi-motifs.jpg",
    imageAlt: "Intricate bridal henna artwork featuring peacock, lotus, and jaali motifs",
    lead: "Peacocks, paisleys and hidden initials — the symbolism behind a full bridal hand.",
    phClass: "ph-mehendi",
    icon: "bi-hand-index-thumb",
    tags: ["Mehendi", "Henna", "Motifs", "Tradition"],
    body: `
      <p class="lead">Bridal mehendi is an ancient visual poetry. Every traditional element woven into your henna design carries centuries of cultural blessing and symbolism.</p>

      <h2>Classic Bridal Motifs & Symbolism</h2>

      <div class="skin-grid">
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-feather" aria-hidden="true"></i> The Peacock (Mayur)</div>
          <p>Symbolizes grace, beauty, and renewal. Historically placed near the wrists or palms as a focal point.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-flower2" aria-hidden="true"></i> The Lotus Flower</div>
          <p>Represents purity of intention, spiritual awakening, and prosperity within the union.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-heart" aria-hidden="true"></i> Paisley (Kalka / Mango)</div>
          <p>The timeless symbol of fertility, abundance, and auspicious good fortune.</p>
        </div>
      </div>

      <h2>Incorporating Modern Storytelling</h2>
      <p>Modern brides often weave love story milestones — proposal city skylines, beloved pets, coordinates, and hidden partner initials — into the intricate cuff and mandala work.</p>
    `
  },
  {
    slug: "how-long-mehendi-takes",
    id: 8,
    title: "How Long Bridal Mehendi Really Takes (and How to Plan Around It)",
    category: "mehendi",
    categoryName: "Mehendi",
    date: "02 Mar 2026",
    readTime: "5 min read",
    author: "Zara Qureshi",
    authorRole: "Master Mehendi & Henna Artist",
    authorBio: "Zara creates bespoke organic Rajasthani, Marwari, Arabic, and minimalist modern henna compositions.",
    authorAvatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&w=120&q=85",
    image: "assets/images/blog/bridal-mehendi-application-session.jpg",
    imageAlt: "Detailed bridal mehendi application on hands and forearms with henna cone",
    lead: "Hands and feet — a realistic hour count so your sangeet timeline survives contact with reality.",
    phClass: "ph-mehendi",
    icon: "bi-clock-history",
    tags: ["Mehendi Timeline", "Planning", "Henna Stain", "Bridal Schedule"],
    body: `
      <p class="lead">Underestimating mehendi application duration is the number one cause of wedding eve fatigue. Here is the realistic schedule you need to plan your event.</p>

      <h2>Application Time Breakdown</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Intricate Full Bridal (Elbows + Feet)</h3>
          <span class="checkpoint-badge">5 – 7 Hours</span>
        </div>
        <p class="small text-muted-au mb-0">High-density Rajasthani or figure work. We recommend scheduling this the morning before your formal Sangeet night so you can relax.</p>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Contemporary Arabic / Mid-Forearm</h3>
          <span class="checkpoint-badge">3 – 4 Hours</span>
        </div>
        <p class="small text-muted-au mb-0">Spaced floral and net patterns with airy skin exposure. Quick drying with high visual contrast.</p>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Stain Darkening Window</h3>
          <span class="checkpoint-badge">24 – 48 Hours</span>
        </div>
        <p class="small text-muted-au mb-0">Henna requires oxygen to oxidize into deep mahogany. Apply mehendi 2 full days before your main ceremony for peak darkness.</p>
      </div>
    `
  },
  {
    slug: "wedding-morning-timeline",
    id: 9,
    title: "The Wedding-Morning Timeline That Does Not Collapse by 11am",
    category: "planning",
    categoryName: "Planning",
    date: "09 Aug 2026",
    readTime: "6 min read",
    author: "Nadia Sethi",
    authorRole: "Founder & Lead Artist",
    authorBio: "Styling over 1,240 brides across 14 years. Nadia leads the Aurelle masterclass on bridal skin prep and photo-ready finishes.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=85",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Bridal suite morning preparation and floral arrangement",
    lead: "How long each service really takes, and where to put the buffer nobody ever budgets for.",
    phClass: "ph-venue",
    icon: "bi-clock-history",
    tags: ["Timeline", "Wedding Morning", "Planning", "Stress-Free"],
    body: `
      <p class="lead">When a wedding-morning timeline fails, it is never because the lipstick took too long — it is because nobody budgeted buffer for bathroom breaks, dress steaming, breakfast, and jewelry clasping.</p>

      <h2>The Non-Negotiable Time Blocks</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Bride Full Hair & Makeup: 2.5 Hours</h3>
          <span class="checkpoint-badge">Bride Slot</span>
        </div>
        <ul class="checkpoint-list">
          <li>30 min: Skin prep, ice depuffing, eye patches, and shoulder massage.</li>
          <li>60 min: Airbrush/HD complexion base, contour, eyes, and lashes.</li>
          <li>60 min: Hair styling, veil pinning, dupatta setting, and final jewelry lock.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Bridal Party Members: 45 Min Per Service</h3>
          <span class="checkpoint-badge">Party Slot</span>
        </div>
        <ul class="checkpoint-list">
          <li>Always schedule bridesmaids and mothers to finish 45 minutes BEFORE the bride.</li>
          <li>This ensures everyone is dressed and ready when the photographer arrives for bridal robe portraits.</li>
        </ul>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">The 45-Minute "Invisible Buffer"</h3>
          <span class="checkpoint-badge">Essential Margin</span>
        </div>
        <ul class="checkpoint-list">
          <li>Put a 45-minute blackout window between the final hairspray mist and the first look.</li>
          <li>Use this time to eat lunch, drink water, take portraits in private, and breathe!</li>
        </ul>
      </div>
    `
  },
  {
    slug: "building-beauty-budget",
    id: 10,
    title: "Building Your Beauty Budget: What Brides Actually Spend",
    category: "planning",
    categoryName: "Planning",
    date: "15 Feb 2026",
    readTime: "8 min read",
    author: "Nadia Sethi",
    authorRole: "Founder & Lead Artist",
    authorBio: "Styling over 1,240 brides across 14 years. Nadia leads the Aurelle masterclass on bridal skin prep and photo-ready finishes.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=85",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Wedding planning notes and atelier stationery",
    lead: "Real numbers from 486 weddings, and the three line items brides underestimate most.",
    phClass: "ph-venue",
    icon: "bi-calculator",
    tags: ["Budget", "Pricing", "Wedding Planning", "Cost Breakdown"],
    body: `
      <p class="lead">Understanding the full spectrum of bridal beauty costs avoids last-minute invoice surprises and helps you allocate funds where they make the greatest photographic impact.</p>

      <h2>Core Line Item Allocations</h2>

      <div class="skin-grid">
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-person-check" aria-hidden="true"></i> Bridal Trials</div>
          <p>Budget $180–$300 for a thorough trial. A comprehensive trial eliminates day-of anxiety and tests longevity.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-gem" aria-hidden="true"></i> Wedding Day Services</div>
          <p>Main bride luxury package usually ranges from $650–$1,400 depending on airbrush, veil drapery, and hair extensions.</p>
        </div>
        <div class="skin-card">
          <div class="skin-card-title"><i class="bi bi-truck" aria-hidden="true"></i> Travel &amp; Early Call Times</div>
          <p>Factor in travel fees for destination bookings or early morning call times prior to 6:00 AM.</p>
        </div>
      </div>
    `
  },
  {
    slug: "priya-arjun-wedding",
    id: 11,
    title: "Inside Priya & Arjun's Rosewood Estate Wedding",
    category: "real-weddings",
    categoryName: "Real Weddings",
    date: "28 Jun 2026",
    readTime: "8 min read",
    author: "Nadia Sethi",
    authorRole: "Founder & Lead Artist",
    authorBio: "Styling over 1,240 brides across 14 years. Nadia leads the Aurelle masterclass on bridal skin prep and photo-ready finishes.",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=85",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Outdoor ceremony setup at Rosewood Estate decorated with garden roses",
    lead: "Fourteen hours, three outfit changes, and an outdoor August ceremony that did not budge.",
    phClass: "ph-flowers",
    icon: "bi-flower3",
    tags: ["Real Wedding", "Case Study", "Rosewood Estate", "Outdoor Styling"],
    body: `
      <p class="lead">Priya and Arjun's multi-ceremony celebration at Rosewood Estate required 3 distinct bridal transformations across a 14-hour marathon wedding day.</p>

      <h2>The Transformation Breakdown</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Morning Traditional Ceremony (10:00 AM)</h3>
          <span class="checkpoint-badge">Look 1</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Complexion:</strong> Velvet matte Airbrush foundation to endure the outdoor summer heat.</li>
          <li><strong>Hair:</strong> Sculpted floral bun anchored to support a heavy 2.5kg gold zardozi dupatta.</li>
        </ul>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Golden Hour Reception (6:30 PM)</h3>
          <span class="checkpoint-badge">Look 2</span>
        </div>
        <ul class="checkpoint-list">
          <li><strong>Quick 40-Min Pivot:</strong> Hair released into flowing romantic Hollywood waves.</li>
          <li><strong>Makeup Refresh:</strong> Swapped to a dewy glass-skin highlighter and bold berry-rose lip.</li>
        </ul>
      </div>
    `
  },
  {
    slug: "udaipur-destination-wedding",
    id: 12,
    title: "A Udaipur Destination Wedding: Four Functions, One Team",
    category: "real-weddings",
    categoryName: "Real Weddings",
    date: "12 Jan 2026",
    readTime: "7 min read",
    author: "Elena Duarte",
    authorRole: "Colour & Skin Specialist",
    authorBio: "Elena specializes in dermatological prep, shade calibration, and sensitive-skin formulation compatibility.",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=85",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85",
    imageAlt: "Palace architecture and royal wedding celebration in Udaipur",
    lead: "How we styled the bride, her mother and both sisters without a single rushed morning.",
    phClass: "ph-jewel",
    icon: "bi-gem",
    tags: ["Destination Wedding", "Udaipur", "Real Wedding", "Luxury Styling"],
    body: `
      <p class="lead">Destination weddings require absolute logistical precision. In January 2026, Aurelle flew a 3-artist team to Udaipur for Tara & Karan's palace wedding at Jagmandir Island.</p>

      <h2>The 4-Function Master Schedule</h2>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Day 1: Royal Mehendi & Poolside Welcome</h3>
          <span class="checkpoint-badge">Function 1</span>
        </div>
        <p class="small text-muted-au mb-0">Organic henna session with airy floral hairstyles and lightweight tinted moisturizer for daytime sunlight.</p>
      </div>

      <div class="checkpoint-card">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Day 2: Grand Palace Sangeet</h3>
          <span class="checkpoint-badge">Function 2</span>
        </div>
        <p class="small text-muted-au mb-0">Smoky bronzed eye artistry, high-shine lips, and textured braided crowns that held through 6 hours of high-energy dancing.</p>
      </div>

      <div class="checkpoint-card gold-accent">
        <div class="checkpoint-header">
          <h3 class="checkpoint-title">Day 3: Sunset Pheras & Reception Banquet</h3>
          <span class="checkpoint-badge">Functions 3 &amp; 4</span>
        </div>
        <p class="small text-muted-au mb-0">A regal, luminous royal bridal aesthetic with double dupatta draping and flawless candlelight photography calibration.</p>
      </div>
    `
  }
];
