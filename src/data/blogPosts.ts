// Blog post data for Brain Heal India
// Each post targets specific search keywords that GenZ audiences actually search for
// Tone: Conversational, empathetic, warm - NOT clinical. Think "best friend who gets it"

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  author: { name: string; role: string };
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  heroImage: string;
  content: string; // HTML content
}

export const BLOG_CATEGORIES = [
  'All',
  'Relationships',
  'Self-Care',
  'Overthinking',
  'Healing',
  'Growth',
  'Wellness',
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-deal-with-breakup',
    title: "It's Okay to Not Be Okay: How to Actually Heal After a Breakup",
    excerpt: "Breakups feel like the world just ended. Your chest hurts, your phone feels empty, and everyone's telling you to 'move on.' But healing isn't a switch - it's a journey. Here's how to actually get through it.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-06-10',
    category: 'Relationships',
    readTime: '8 min read',
    tags: ['breakup', 'healing', 'relationships', 'self-care', 'moving on'],
    heroImage: '',
    content: `
<p>Let's be real - breakups <em>suck</em>. Whether you were together for 6 months or 6 years, the pain is real. Your brain literally goes through withdrawal, like coming off a drug. And no, you're not being "dramatic."</p>

<p>If you're reading this at 2 AM with tears on your pillow, just know - <strong>you're not alone</strong>. Millions of people are going through the exact same thing right now. And it WILL get better. Not today, maybe not tomorrow, but it will.</p>

<h2>Why Does a Breakup Hurt So Much?</h2>

<p>Here's something most people don't tell you: breakup pain is <em>scientifically</em> similar to physical pain. Your brain processes rejection in the same area that handles physical injuries. So when you say "my heart hurts" - it's not just a metaphor. Your brain is literally registering pain.</p>

<p>When you're in love, your brain floods with dopamine, oxytocin, and serotonin - the same chemicals that make you feel happy, safe, and connected. When that person suddenly disappears from your life, your brain goes into panic mode. It's looking for that "hit" of love chemicals and can't find it.</p>

<p>That's why you feel:</p>
<ul>
  <li>An actual ache in your chest</li>
  <li>Nauseous, like you can't eat anything</li>
  <li>Exhausted but unable to sleep</li>
  <li>Like checking their Instagram every 5 minutes</li>
  <li>Replaying every memory on loop</li>
</ul>

<p><strong>This is normal.</strong> You're not weak. You're human.</p>

<h2>The 5 Stages You'll Go Through (And Why Each One Matters)</h2>

<h3>1. The Shock Phase 💔</h3>
<p>First few days - you're numb. Everything feels surreal. You might even be calm on the outside while screaming inside. This is your brain protecting you from processing too much pain at once.</p>
<p><strong>What helps:</strong> Let yourself feel it. Don't force yourself to be "strong." Cry if you need to. Call your best friend at 3 AM. It's okay.</p>

<h3>2. The Obsessive Phase 🔄</h3>
<p>This is where you start replaying everything. "What if I had done this differently?" "What did they mean when they said that?" You might stalk their social media, re-read old messages, or draft texts you'll never send.</p>
<p><strong>What helps:</strong> Mute (not unfollow - mute) them on every platform. You don't need to see their stories. Put your phone in another room at night. Talk to someone - a friend, a family member, or even a stranger on <a href="https://brainheal.in/community">Brain Heal's anonymous community</a>.</p>

<h3>3. The Anger Phase 🔥</h3>
<p>"How DARE they throw away what we had?" Good. Feel that anger. It means you're starting to process the hurt underneath. Anger is just pain wearing armor.</p>
<p><strong>What helps:</strong> Write a letter you'll never send. Scream into a pillow. Go for a run. Channel that energy into something physical.</p>

<h3>4. The Bargaining Phase 🙏</h3>
<p>"Maybe if I change, they'll come back." "Maybe I should text them one more time." This is your brain trying to undo the loss. It's painful, but it's also a sign that you're starting to accept that things have changed.</p>
<p><strong>What helps:</strong> Talk to someone who has been through this. Sometimes you need someone who has already survived the storm to tell you - "I know it feels impossible right now, but you WILL get through this."</p>

<h3>5. The Acceptance Phase ☀️</h3>
<p>One morning you'll wake up and realize - you didn't think about them first thing today. The songs don't hurt as much. You start imagining a future that doesn't include them. And it feels... okay.</p>
<p><strong>What helps:</strong> Celebrate small wins. Going a whole day without crying? That's growth. Laughing at a meme? That's healing. Being excited about something new? That's your life coming back to you.</p>

<h2>10 Things That Actually Help (Not the Toxic "Just Move On" Advice)</h2>

<ol>
  <li><strong>Delete their number</strong> - or at least give it to a friend so you can't drunk-text</li>
  <li><strong>Rearrange your room</strong> - change the energy of your space</li>
  <li><strong>Start a "brain dump" journal</strong> - write everything you're feeling, no filter</li>
  <li><strong>Move your body</strong> - even a 10-minute walk releases endorphins</li>
  <li><strong>Let yourself be sad</strong> - suppressing emotions only delays healing</li>
  <li><strong>Unfollow/mute relationship content</strong> - your For You Page doesn't need to be full of couple goals right now</li>
  <li><strong>Talk to someone anonymous</strong> - sometimes it's easier to open up to a stranger. That's why <a href="https://brainheal.in/community">Brain Heal's community</a> exists</li>
  <li><strong>Set small daily goals</strong> - "Today I will eat one proper meal and drink water"</li>
  <li><strong>Avoid making big decisions</strong> - don't cut your hair, quit your job, or text your ex for at least 30 days</li>
  <li><strong>Be patient with yourself</strong> - healing isn't linear. Some days will be harder than others. That's okay.</li>
</ol>

<h2>When Should You Talk to Someone Professional?</h2>

<p>Look, your friends are amazing. But sometimes you need someone who can really <em>listen</em> without judgment, without unsolicited advice, without comparing your pain to theirs.</p>

<p>Consider talking to someone if:</p>
<ul>
  <li>It's been weeks and you still can't eat, sleep, or function</li>
  <li>You're having thoughts of hurting yourself</li>
  <li>You feel completely numb and disconnected from everything</li>
  <li>You're using alcohol, substances, or risky behavior to cope</li>
</ul>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, we don't believe therapy should feel scary or clinical. Think of it as having a really good conversation with someone who actually gets it - someone trained to help you untangle the mess in your head. No judgment. No lectures. Just real talk.</p>

<p>Your first session starts at just ₹111, and you can switch your therapist anytime if you don't feel the connection. Because at Brain Heal, we believe healing should be accessible, affordable, and on your terms.</p>

<h2>A Note From Us 💜</h2>

<p>If you're going through a breakup right now - we see you. We know it feels like the pain will never end. But we promise you, on the other side of this, there's a version of you who is stronger, wiser, and more in love with yourself than you ever thought possible.</p>

<p>You don't have to go through this alone. Whether it's our <a href="https://brainheal.in/community">anonymous community</a>, a <a href="https://brainheal.in/therapy">heart-to-heart with a therapist</a>, or just reading this and knowing someone out there cares - we're here.</p>

<p><em>Take care of yourself today. You deserve it.</em> 💜</p>
`
  },

  {
    slug: 'how-to-stop-overthinking',
    title: "Your Brain Won't Shut Up? Here's How to Actually Stop Overthinking",
    excerpt: "3 AM. Staring at the ceiling. Replaying that conversation from 2019. Wondering if everyone secretly hates you. Sound familiar? Let's talk about how to quiet that noisy brain of yours.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-06-08',
    category: 'Overthinking',
    readTime: '7 min read',
    tags: ['overthinking', 'anxiety', 'mental health', 'sleep', 'peace of mind'],
    heroImage: '',
    content: `
<p>You know that thing where your brain decides to replay every embarrassing moment of your life at 3 AM? Or when you send a text and immediately spiral into "what if they hate me now?" Yeah. We need to talk about that.</p>

<p><strong>Overthinking isn't just "thinking too much."</strong> It's your brain's alarm system going haywire. It's trying to protect you from danger - except the "danger" is a text message that got left on read.</p>

<h2>Why Do We Overthink?</h2>

<p>Here's the thing - your brain is literally wired to look for threats. Back when humans lived in caves, this kept us alive. "Is that a tiger in the bushes? BETTER THINK ABOUT IT 50 TIMES." But in 2026, there are no tigers. Instead, your brain treats a coworker's slightly cold email like a life-threatening emergency.</p>

<p>Common overthinking triggers:</p>
<ul>
  <li>Someone's tone changed in a conversation</li>
  <li>A friend didn't reply for hours</li>
  <li>You said something weird and now it's on repeat forever</li>
  <li>Imagining worst-case scenarios about everything</li>
  <li>"What if" thoughts that never end</li>
  <li>Comparing yourself to everyone on Instagram</li>
</ul>

<p>If you nodded at any of these - welcome to the club. Population: literally everyone you know.</p>

<h2>The Overthinking Loop (And How to Break It)</h2>

<p>Overthinking follows a pattern:</p>
<ol>
  <li><strong>Trigger</strong> → something happens (or doesn't happen)</li>
  <li><strong>Story</strong> → your brain creates a narrative ("they hate me")</li>
  <li><strong>Spiral</strong> → one thought leads to another, then another</li>
  <li><strong>Paralysis</strong> → you can't do anything because you're stuck in your head</li>
  <li><strong>Guilt</strong> → you feel bad for overthinking, which makes you overthink more</li>
</ol>

<p>Sound familiar? Let's break each step.</p>

<h2>7 Things That Actually Work (Tested by Real Overthinkers)</h2>

<h3>1. The "5-4-3-2-1" Ground Yourself Trick</h3>
<p>When your brain is spiraling, anchor yourself to the present moment:</p>
<ul>
  <li><strong>5</strong> things you can see</li>
  <li><strong>4</strong> things you can touch</li>
  <li><strong>3</strong> things you can hear</li>
  <li><strong>2</strong> things you can smell</li>
  <li><strong>1</strong> thing you can taste</li>
</ul>
<p>This pulls your brain out of the spiral and back into reality. It sounds simple. It works stupidly well.</p>

<h3>2. Set a "Worry Window"</h3>
<p>Give yourself 15 minutes a day to worry about everything. Set a timer. Worry your heart out. When the timer goes off - you're done. If a worry pops up later, tell yourself "I'll worry about that during my worry window tomorrow."</p>
<p>It sounds ridiculous, but it actually trains your brain to delay and contain anxious thoughts.</p>

<h3>3. Write It Down (Brain Dump)</h3>
<p>Take everything swirling in your head and dump it onto paper. Don't organize it. Don't make it pretty. Just write. Your brain holds onto thoughts because it's afraid of forgetting them. Once they're on paper, your brain relaxes.</p>

<h3>4. Talk to Someone (Even a Stranger)</h3>
<p>Sometimes the best therapy is just saying your thoughts out loud. Hearing yourself say "I think everyone hates me because Priya didn't like my story" makes you realize... maybe it's not that deep.</p>
<p>If you don't want to burden your friends (we've all been there), try <a href="https://brainheal.in/community">Brain Heal's anonymous community</a>. Post what's on your mind. You'll be surprised how many people feel the exact same way.</p>

<h3>5. Move Your Body</h3>
<p>Your brain and body are connected. When your mind is racing, your body is usually tense. Go for a walk. Do 10 jumping jacks. Dance to one song. Physical movement interrupts the mental loop.</p>

<h3>6. Limit Your Information Diet</h3>
<p>Stop doom-scrolling. Unfollow accounts that make you compare yourself. Mute toxic group chats. Your brain can only process so much before it starts overheating.</p>

<h3>7. Challenge the Thought</h3>
<p>When you catch yourself overthinking, ask:</p>
<ul>
  <li>"Is this a fact or a story I'm telling myself?"</li>
  <li>"Will this matter in 5 years?"</li>
  <li>"Am I confusing a feeling with a fact?"</li>
  <li>"What would I tell my best friend if she thought this?"</li>
</ul>

<h2>When Overthinking Becomes Too Much</h2>

<p>If your overthinking is:</p>
<ul>
  <li>Stopping you from sleeping most nights</li>
  <li>Making you avoid social situations</li>
  <li>Causing physical symptoms (headaches, chest tightness, nausea)</li>
  <li>Making you feel like you're "going crazy"</li>
</ul>

<p>...it might be time to talk to someone who can really help. Not Google. Not Reddit. An actual human who understands how brains work.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, talking to someone doesn't mean you're "broken." It means you're brave enough to say "I need help untangling this." Our therapists are warm, young, and actually get what it's like to live in this overstimulating world. Sessions start at ₹111.</p>

<p><em>Your mind deserves peace. And you deserve to sleep at night without your brain holding a TED talk.</em> 💜</p>
`
  },

  {
    slug: 'toxic-relationship-signs',
    title: "Is Your Relationship Toxic? 12 Signs You're Ignoring (But Shouldn't)",
    excerpt: "Love shouldn't feel like walking on eggshells. If you're constantly anxious, apologizing for things that aren't your fault, or feeling drained after every conversation - read this.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-06-06',
    category: 'Relationships',
    readTime: '9 min read',
    tags: ['toxic relationship', 'red flags', 'gaslighting', 'manipulation', 'healthy relationship'],
    heroImage: '',
    content: `
<p>Let's get one thing straight - love should make you feel <em>safe</em>, not anxious. If being with someone feels like an emotional rollercoaster where the highs are incredible but the lows make you question your sanity... we need to talk.</p>

<p>Toxic relationships don't always look like what you see in movies. Sometimes it's subtle. Sometimes it's the person who says "I love you" but makes you feel like you're never enough. Sometimes it's the person who's amazing in front of others but a completely different human when you're alone.</p>

<h2>12 Signs Your Relationship Might Be Toxic</h2>

<h3>1. You're Always Walking on Eggshells 🥚</h3>
<p>You carefully choose your words. You monitor their mood before speaking. You avoid certain topics because you "don't want to start something." If you feel like you need to manage another person's emotions just to keep the peace - that's not love. That's survival mode.</p>

<h3>2. They Gaslight You 💡</h3>
<p>"That never happened." "You're being dramatic." "You're too sensitive." If you find yourself questioning your own memory, perception, or feelings because of what they say - that's gaslighting. It's one of the most insidious forms of emotional manipulation, and it slowly erodes your sense of reality.</p>

<h3>3. Love-Bombing Followed by Cold Shoulders ❄️</h3>
<p>One day they're showering you with affection - "you're the best thing that ever happened to me." The next day they're distant, cold, or ignoring your messages. This hot-cold cycle is addictive (literally - it triggers the same brain chemicals as gambling) and keeps you hooked.</p>

<h3>4. They Isolate You from Friends & Family 🔒</h3>
<p>"I don't like when you hang out with them." "Your friends don't really care about you like I do." "Why do you need to talk to others when you have me?" Slowly pulling you away from your support system is a classic manipulation tactic.</p>

<h3>5. Everything Is Your Fault 🎯</h3>
<p>They cheated? "Well, if you gave me more attention..." They got angry and said hurtful things? "You provoked me." In a toxic relationship, you become the scapegoat for everything. You start believing you're the problem.</p>

<h3>6. They Track & Control You 📱</h3>
<p>"Who are you texting?" "Send me your location." "Why were you online at 1 AM?" Checking your phone, demanding passwords, or monitoring your movements isn't protection - it's control.</p>

<h3>7. You Feel Drained After Being with Them 🔋</h3>
<p>A healthy relationship should energize you. If you feel emotionally exhausted, anxious, or relieved when they're not around - your body is telling you something. Listen to it.</p>

<h3>8. They Weaponize Your Vulnerabilities 🗡️</h3>
<p>You opened up about your insecurities, your past, your fears - and now they use them against you during fights. "No wonder your ex left you." "You've always been like this." Your vulnerabilities should be held with care, not used as ammunition.</p>

<h3>9. They Never Take Accountability 🚫</h3>
<p>"I'm sorry you feel that way" is NOT an apology. "I'm sorry BUT..." is NOT an apology. If they can never genuinely say "I was wrong, and I'll do better" - they're not capable of healthy conflict resolution.</p>

<h3>10. You've Lost Yourself 🪞</h3>
<p>You used to have hobbies, opinions, dreams. Now everything revolves around them. You've changed who you are to become what they want. If you look in the mirror and don't recognize the person staring back - that's a sign.</p>

<h3>11. The "Good Times" Are Just the Absence of Bad Times 📅</h3>
<p>When someone asks "but there are good times too, right?" and your answer is "well, they haven't yelled at me in a week" - that's not a good time. That's just a pause between storms.</p>

<h3>12. Your Gut Knows 🫀</h3>
<p>Deep down, you know. You've probably Googled "is my relationship toxic" more than once. You've read articles like this one hoping someone would validate what you're feeling. So here it is: <strong>if it feels wrong, it probably is.</strong></p>

<h2>What Now?</h2>

<p>Recognizing toxicity is the hardest step - and you just did it by reading this far. Here's what you can do:</p>

<ul>
  <li><strong>Talk to someone you trust</strong> - a friend, a sibling, or anyone who knows you outside of this relationship</li>
  <li><strong>Write down specific incidents</strong> - when you're in a toxic relationship, your brain tends to minimize the bad stuff. Writing it down makes it real.</li>
  <li><strong>Set one small boundary</strong> - it doesn't have to be dramatic. Start with something small like "I need space when we argue" and see how they respond. A healthy partner respects boundaries. A toxic one punishes you for having them.</li>
  <li><strong>Seek support</strong> - you don't have to figure this out alone. Talk to someone on <a href="https://brainheal.in/community">Brain Heal's community</a> or <a href="https://brainheal.in/therapy">connect with a therapist</a> who specializes in relationships.</li>
</ul>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, our therapists are trained to help you see what love should actually look like - not the fairy tale version, but a real, healthy partnership where you feel safe, heard, and valued. No judgment. No telling you what to do. Just someone in your corner helping you figure it out.</p>

<p><em>You deserve a love that feels like peace, not chaos. Remember that.</em> 💜</p>
`
  },

  {
    slug: 'feeling-lonely-what-to-do',
    title: "Feeling Lonely Even When You're Surrounded by People? You're Not Alone",
    excerpt: "The most crowded room can feel like the loneliest place. If you're smiling on the outside but empty on the inside - this one's for you.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-06-04',
    category: 'Healing',
    readTime: '7 min read',
    tags: ['loneliness', 'connection', 'social anxiety', 'belonging', 'isolation'],
    heroImage: '',
    content: `
<p>Loneliness isn't about being alone. You can be alone and feel perfectly content. You can also be at a party with 50 people and feel like no one in the world understands you.</p>

<p><strong>That kind of loneliness - the one that sits in your chest even when you're surrounded by people - is one of the most painful human experiences.</strong> And in 2026, despite being more "connected" than ever through social media, more people feel lonely than at any other time in history.</p>

<p>If you're reading this and feeling that ache - we see you. Let's talk about it.</p>

<h2>Why Do So Many of Us Feel Lonely?</h2>

<h3>The Social Media Paradox</h3>
<p>We see 500 stories a day of people laughing, traveling, hanging out. Everyone seems to have a "squad." Meanwhile, you're in bed at 9 PM wondering why no one checked on you today. Social media shows us the highlight reels of everyone else's connections while we sit with our behind-the-scenes.</p>

<h3>Surface-Level Friendships</h3>
<p>You might have people to party with but no one to cry with. You might have 1000 Instagram followers but not one person you can call at 2 AM. In a world of group chats and "let's catch up soon" that never happens - deep, real connections feel rare.</p>

<h3>The Pressure to Be "Fine"</h3>
<p>"How are you?" "I'm fine!" - the most common lie we tell each other. We've been conditioned to perform happiness. Admitting you're lonely feels like admitting you're a failure. So we keep the mask on.</p>

<h2>Things That Actually Help with Loneliness</h2>

<h3>1. Start Small - Say One Real Thing Today</h3>
<p>You don't need to have a deep, soul-baring conversation. Just say one honest thing to someone. "I've been feeling really low lately" or "I had a tough week." You'll be surprised how many people respond with "me too."</p>

<h3>2. Find Your People (They Might Not Be Where You Expect)</h3>
<p>Sometimes your people aren't in your college or workplace. They might be in an online community, a hobby group, or a place you haven't looked yet. <a href="https://brainheal.in/community">Brain Heal's anonymous community</a> was built exactly for this - a space where you can say what you really feel without judgment, without filters, without pretending.</p>

<h3>3. Quality Over Quantity</h3>
<p>You don't need 20 friends. You need 2-3 people who actually care. Focus on deepening existing connections rather than collecting new ones. Send that "thinking of you" message. Ask someone how they're <em>really</em> doing. Be the friend you wish you had.</p>

<h3>4. Get Comfortable with Your Own Company</h3>
<p>There's a difference between being lonely and being alone. Learning to enjoy your own company - taking yourself on a date, journaling, going for a solo walk - can transform how you experience solitude.</p>

<h3>5. Talk to Someone Who Listens for Real</h3>
<p>Sometimes the loneliest feeling is having a lot to say and no one to say it to. That's where talking to a therapist can be genuinely life-changing. It's not about being "mentally ill" - it's about having one person in your life whose entire job is to <em>listen</em> to you. Really, truly listen.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, we match you with someone who gets your world. Young, warm, no judgment. Think of it as booking a conversation with someone who actually cares. Starting at just ₹111.</p>

<p><em>Loneliness is not a life sentence. It's a signal that you need connection - and connection is always possible.</em> 💜</p>
`
  },

  {
    slug: 'self-love-after-heartbreak',
    title: "How to Fall in Love with Yourself (Especially After Someone Broke Your Heart)",
    excerpt: "They left. And they took your confidence with them. But here's the truth they never told you - the love you gave them? You can give it to yourself. Here's how.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-06-02',
    category: 'Self-Care',
    readTime: '8 min read',
    tags: ['self love', 'confidence', 'healing', 'self care', 'heartbreak recovery'],
    heroImage: '',
    content: `
<p>After a heartbreak, the hardest thing isn't missing them. It's looking in the mirror and wondering - <em>was I not enough?</em></p>

<p>That question is a liar. Let's get that out of the way right now. <strong>You were always enough.</strong> The fact that someone couldn't see your value says everything about their vision and nothing about your worth.</p>

<p>But knowing that intellectually and <em>feeling</em> it in your bones? That's the real challenge. So let's work on that.</p>

<h2>Why Heartbreak Destroys Your Self-Worth</h2>

<p>When someone we love leaves, our brain does this terrible thing: it starts looking for reasons why. And since the other person isn't here to explain, our brain turns inward. "Maybe I wasn't pretty enough." "Maybe I was too clingy." "Maybe I'm just unlovable."</p>

<p>These aren't facts. They're your brain's desperate attempt to make sense of pain. Your brain would rather blame YOU than accept that sometimes people just aren't compatible, or that some people aren't capable of the love you deserve.</p>

<h2>The Self-Love Starter Kit (No Toxic Positivity, Promise)</h2>

<h3>1. Stop Performing Happiness</h3>
<p>You don't need to post a "glow up" selfie or tweet about how "unbothered" you are. Real self-love starts with giving yourself permission to feel bad. Cry in the shower. Eat ice cream for dinner. Watch that sad movie. Healing isn't pretty, and it doesn't need to be Instagram-worthy.</p>

<h3>2. Write Yourself a Love Letter</h3>
<p>This sounds cheesy, but try it. Write a letter to yourself from the perspective of your best friend. What would they say about you? How would they describe your best qualities? Read it when you're spiraling. It helps. A lot.</p>

<h3>3. Reconnect with Who You Were Before Them</h3>
<p>What did you enjoy before the relationship consumed everything? Did you like painting? Reading? Dancing alone in your room? Go back to those things. Not because they'll "distract" you, but because those things are part of who you are - and you lost touch with them while trying to be what someone else wanted.</p>

<h3>4. Set Boundaries with Yourself</h3>
<p>No more checking their profile. No more re-reading old chats. No more wondering what they're doing at 11 PM. Every time you check, you're reopening the wound. Set a rule: "I will not look at anything related to them for 24 hours." Then do it again tomorrow. Then the next day.</p>

<h3>5. Do One Kind Thing for Yourself Every Day</h3>
<p>It doesn't need to be grand. Take a long shower. Buy yourself flowers. Cook your comfort food. Put on clean bedsheets. Small acts of self-care are love letters to yourself.</p>

<h3>6. Talk It Out</h3>
<p>The heaviest weight is the one you carry in silence. Whether it's a friend, a journal, <a href="https://brainheal.in/community">Brain Heal's community</a>, or a <a href="https://brainheal.in/therapy">therapist</a> - say what's in your heart. Out loud. The more you say it, the less power it has over you.</p>

<h2>Affirmations That Don't Feel Fake</h2>

<p>We're not going to tell you to stand in front of a mirror and say "I am a queen." If that works for you, great. But here are some gentler truths you can hold onto:</p>

<ul>
  <li>"I am worthy of love that doesn't hurt."</li>
  <li>"Them leaving was not proof that I'm not enough."</li>
  <li>"I am allowed to take up space, make noise, and be imperfect."</li>
  <li>"The love I gave them? I can give it to myself now."</li>
  <li>"My timeline is not behind. I am exactly where I need to be."</li>
</ul>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, we believe healing starts with being heard. If you want someone in your corner - someone who won't judge, won't lecture, won't tell you to "just get over it" - our therapists are here. Starting at ₹111, because self-love shouldn't cost a fortune. 💜</p>
`
  },

  {
    slug: 'anxiety-at-night-cant-sleep',
    title: "Can't Sleep Because Your Brain Won't Stop? A Night Owl's Guide to Peace",
    excerpt: "The world gets quiet at night. But your brain? It decides to replay every mistake you've ever made. If your nights feel louder than your days, this is for you.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-05-30',
    category: 'Wellness',
    readTime: '7 min read',
    tags: ['anxiety', 'insomnia', 'sleep', 'nighttime anxiety', 'peace of mind', 'racing thoughts'],
    heroImage: '',
    content: `
<p>11 PM. You get into bed. Close your eyes. And then...</p>

<p><em>"Did I lock the door?"</em><br>
<em>"What if I fail that exam?"</em><br>
<em>"Why did I say that weird thing in 2021?"</em><br>
<em>"What am I even doing with my life?"</em></p>

<p>And just like that, your brain is hosting an unsolicited 3-hour TED talk about everything that has ever gone wrong or could possibly go wrong in the future.</p>

<p><strong>You're not crazy. You have nighttime anxiety.</strong> And it's incredibly common - especially if you're in your 20s, stressed about life, or going through something emotionally heavy.</p>

<h2>Why Does Anxiety Get Worse at Night?</h2>

<p>During the day, your brain is busy - work, conversations, social media, commuting. It doesn't have time to process your feelings. But at night, when everything goes quiet, your brain finally has bandwidth. And it uses that bandwidth to panic about literally everything.</p>

<p>Think of it like your brain's to-do list. All day, it's been piling up worries, fears, and unprocessed emotions into a "deal with later" folder. Nighttime is "later."</p>

<h2>A Calming Nighttime Routine (That Actually Works)</h2>

<h3>🌙 1 Hour Before Bed: Wind Down</h3>
<ul>
  <li>Put your phone on Do Not Disturb (or in another room)</li>
  <li>Dim the lights - your brain needs darkness signals to produce melatonin</li>
  <li>Take a warm shower - the temperature drop afterward makes you sleepy</li>
  <li>Make a calming drink - chamomile tea, warm milk, whatever feels cozy</li>
</ul>

<h3>📝 30 Minutes Before Bed: Brain Dump</h3>
<p>Grab a notebook and write down everything on your mind. Every worry, every task, every random thought. Get it OUT of your head and onto paper. Tell your brain: "I've written it down. I won't forget. I can deal with it tomorrow."</p>

<h3>🧘 15 Minutes Before Bed: Breathe</h3>
<p>Try the 4-7-8 breathing technique:</p>
<ul>
  <li>Breathe in for <strong>4 seconds</strong></li>
  <li>Hold for <strong>7 seconds</strong></li>
  <li>Breathe out slowly for <strong>8 seconds</strong></li>
</ul>
<p>Repeat 4 times. This activates your parasympathetic nervous system - literally telling your body "we're safe, we can rest."</p>

<h3>🎧 In Bed: Replace the Spiral</h3>
<p>Instead of lying in silence (which is an open invitation for your brain to spiral), play something calming:</p>
<ul>
  <li>Sleep stories or meditations (YouTube has thousands for free)</li>
  <li>Rain sounds or white noise</li>
  <li>A boring podcast (something you won't get invested in)</li>
</ul>

<h2>What If Nothing Works?</h2>

<p>If you've tried everything and your nights are still filled with anxiety, racing thoughts, or full-blown panic - it's okay to ask for help. Nighttime anxiety can be a sign that something deeper needs attention, and talking to someone can make a world of difference.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, we have therapists who specialize in anxiety and sleep issues. Think of it as having a conversation that helps your brain learn to relax. Not scary. Not clinical. Just someone who helps you find your calm. Sessions from ₹111.</p>

<p>And if you just need to vent at 2 AM - <a href="https://brainheal.in/community">our anonymous community</a> is always awake. Post what's on your mind. Someone will listen. 💜</p>

<p><em>You deserve nights that feel like rest, not a battlefield.</em></p>
`
  },

  {
    slug: 'burnout-hate-my-job',
    title: "Burnout Is Real: What to Do When You're Exhausted but Can't Stop",
    excerpt: "Sunday night dread. Monday morning tears. Living for the weekend just to spend it recovering from the week. If work is slowly destroying you - let's talk about it.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-05-28',
    category: 'Growth',
    readTime: '8 min read',
    tags: ['burnout', 'work stress', 'career anxiety', 'work life balance', 'exhaustion'],
    heroImage: '',
    content: `
<p>There's tired, and then there's <em>tired</em>. The kind where you wake up exhausted. Where the thought of opening your laptop makes your chest tight. Where you've cried in the office bathroom more times than you can count. Where Sunday evening fills you with genuine dread.</p>

<p><strong>That's not laziness. That's burnout.</strong> And it's an epidemic that nobody talks about because we've been told that being busy = being valuable.</p>

<h2>Are You Burned Out? (Honest Checklist)</h2>

<p>Check the ones that apply:</p>
<ul>
  <li>☐ You feel exhausted even after sleeping 8+ hours</li>
  <li>☐ You've become cynical about work that you used to enjoy</li>
  <li>☐ You're making more mistakes than usual</li>
  <li>☐ Small tasks feel overwhelming</li>
  <li>☐ You fantasize about quitting daily</li>
  <li>☐ Your body is showing signs - headaches, back pain, stomach issues</li>
  <li>☐ You feel emotionally numb or detached</li>
  <li>☐ You're snapping at people you love</li>
  <li>☐ You can't remember the last time you genuinely laughed</li>
  <li>☐ You feel guilty for resting</li>
</ul>

<p>If you checked 3 or more - babe, you're burned out. And it's not your fault.</p>

<h2>Why Hustle Culture Is Destroying Us</h2>

<p>We grew up hearing "work hard, play later." LinkedIn is full of people flexing 80-hour work weeks. "Rise and grind." "Sleep is for the weak." Cool. And also - completely unsustainable and dangerous.</p>

<p>Your body is not a machine. Your brain is not a computer. You cannot optimize yourself into happiness. At some point, the engine breaks down. And that breakdown manifests as burnout - physically, emotionally, and mentally.</p>

<h2>How to Start Recovering (Even If You Can't Quit)</h2>

<h3>1. Micro-Breaks Throughout the Day</h3>
<p>You don't need a 2-week vacation (though that would be nice). Start with small breaks. 5 minutes every hour. Step away from your screen. Look out the window. Stretch. Breathe. These tiny pauses compound into significant recovery over time.</p>

<h3>2. Learn to Say "No" (Even If It's Terrifying)</h3>
<p>"No" is a complete sentence. You don't need to justify it. Start with low-stakes no's: "No, I can't take on that extra project." "No, I won't check email after 8 PM." Every boundary you set is a brick in the wall protecting your sanity.</p>

<h3>3. Separate Your Identity from Your Job</h3>
<p>You are not your job title. You are not your productivity. If you were fired tomorrow, you would still be a whole, worthy person. Start building identity outside of work - a hobby, a community, a creative pursuit. Something that reminds you that you exist beyond your to-do list.</p>

<h3>4. Tell Someone How You're Really Doing</h3>
<p>Stop saying "I'm fine." Tell someone the truth. "I'm really struggling." "I cry before going to work." "I feel like I'm drowning." Saying it out loud is the first step to getting help.</p>

<p>If you can't tell someone you know, try <a href="https://brainheal.in/community">Brain Heal's anonymous community</a>. Or <a href="https://brainheal.in/therapy">talk to a therapist</a> who specializes in career stress and burnout. Sometimes an outside perspective is exactly what you need to see what you can't see from inside the storm.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, our approach is simple - we listen, we help you figure out what's actually going on, and we work with you to create a life that doesn't constantly drain you. Starting at ₹111. Because you shouldn't have to be rich to take care of your mind.</p>

<p><em>You are more than your output. Rest is not reward - it's a requirement.</em> 💜</p>
`
  },

  {
    slug: 'how-to-trust-again',
    title: "They Cheated. Now What? How to Rebuild Trust (In Others & In Yourself)",
    excerpt: "Being cheated on doesn't just break your heart - it breaks your ability to trust. Not just others, but yourself. 'How did I not see it?' Sound familiar? Let's unpack this.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-05-26',
    category: 'Relationships',
    readTime: '9 min read',
    tags: ['cheating', 'trust issues', 'infidelity', 'betrayal', 'healing after cheating'],
    heroImage: '',
    content: `
<p>Being cheated on is one of those experiences that changes you at a fundamental level. It's not just about losing a partner - it's about losing your faith in love, in people, and worst of all, in your own judgment.</p>

<p><em>"How did I not see it?"</em><br>
<em>"Was I stupid?"</em><br>
<em>"Am I ever going to trust anyone again?"</em></p>

<p>If these questions keep you up at night - first, know that <strong>this is not your fault</strong>. You weren't "stupid" for trusting someone. You were human. They were the one who broke something sacred. Not you.</p>

<h2>Why Being Cheated On Hurts Different</h2>

<p>A breakup hurts. Being cheated on <em>destroys</em>. Because it's not just loss - it's betrayal. The person who was supposed to be your safe space turned out to be the source of your deepest pain. That cognitive dissonance - loving someone who hurt you - is what makes it so incredibly difficult to process.</p>

<p>Your brain is literally trying to reconcile two contradictory truths: "This person loves me" and "This person chose to betray me." No wonder your head is spinning.</p>

<h2>The Trust Crisis: Why You Can't Trust Yourself Anymore</h2>

<p>Here's something people don't talk about enough - after being cheated on, the hardest person to trust is <em>yourself</em>. You start doubting your own instincts:</p>
<ul>
  <li>"My gut said something was off, but I ignored it."</li>
  <li>"I believed their lies. What does that say about me?"</li>
  <li>"How do I know my judgment won't fail me again?"</li>
</ul>

<p><strong>Your judgment didn't fail you.</strong> You were lied to by someone you had every reason to trust. That's not a failure of your instincts - it's a failure of their character. There's a massive difference.</p>

<h2>How to Rebuild Trust (A Gentle Guide)</h2>

<h3>Step 1: Feel Everything</h3>
<p>Anger, sadness, confusion, rage, numbness, betrayal - let it all come. Don't rush to "forgive and forget." That's toxic advice that prioritizes the other person's comfort over your healing. You have every right to feel devastated. Own it.</p>

<h3>Step 2: Stop Blaming Yourself</h3>
<p>You did not cause them to cheat. Nothing you did or didn't do justified their choice to betray your trust. Repeat that until you believe it. Write it on your mirror if you need to.</p>

<h3>Step 3: Rebuild Trust in Yourself First</h3>
<p>Before you can trust others again, you need to trust your own instincts again. Start small:</p>
<ul>
  <li>Make a small promise to yourself and keep it. ("I'll go for a walk every morning.")</li>
  <li>Listen to your gut in everyday situations. ("Something feels off about this. I'm going to honor that feeling.")</li>
  <li>Validate your own emotions. ("I feel sad and that's valid. I don't need anyone else to tell me it's okay to feel this way.")</li>
</ul>

<h3>Step 4: Don't Punish the Next Person</h3>
<p>This is the hardest part. When someone new enters your life, your brain will be on high alert. Every late reply, every night out with friends, every unexplained mood change - your brain will scan for threats. That's your trauma talking, not reality.</p>

<p>The key is to be <em>aware</em> of your triggers without letting them control you. "I feel anxious because they didn't reply. Is this based on evidence or past trauma?" Learning to ask yourself this question is a superpower.</p>

<h3>Step 5: Talk to Someone Who Gets It</h3>
<p>Your friends mean well, but "just forget about them" isn't helpful. What IS helpful is talking to someone who understands the psychology of betrayal, attachment, and trust. Someone who can help you untangle the mess without judgment.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, we have therapists who specialize in relationship trauma. They won't tell you what to do. They'll help you figure out what YOU want to do. Think of it as having a conversation that gives you clarity. Starting at ₹111.</p>

<p><em>Being cheated on is not the end of your love story. It's the plot twist that leads you to something real.</em> 💜</p>
`
  },

  {
    slug: 'what-to-do-when-feeling-lost',
    title: "Feeling Lost in Life? Here's Your Permission to Not Have It All Figured Out",
    excerpt: "Everyone around you seems to know exactly where they're going. Meanwhile, you're Googling 'what to do with my life' at 2 AM. Spoiler: most of them are faking it too.",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-05-24',
    category: 'Growth',
    readTime: '7 min read',
    tags: ['feeling lost', 'quarter life crisis', 'career confusion', 'purpose', 'life direction'],
    heroImage: '',
    content: `
<p>There's a special kind of panic that hits you in your 20s. Everyone on LinkedIn is getting promoted. Your school friends are getting married. Someone you know just bought a car. And you're sitting there thinking - <em>what am I even doing?</em></p>

<p><strong>Welcome to the quarter-life crisis.</strong> It's real, it's common, and despite what Instagram tells you - literally everyone goes through it. The difference is, most people are too afraid to admit it.</p>

<h2>Why Do We Feel "Lost"?</h2>

<p>Growing up, life had a clear path: school → college → job → success → happiness. Nobody told us that after college, the path just... disappears. Suddenly there's no syllabus, no semester system, no clear next step. Just an open field and a terrifying amount of freedom.</p>

<p>Add to that the constant comparison machine called social media, where everyone's curated highlight reel makes your behind-the-scenes look pathetic - and boom, existential crisis served on a platter.</p>

<h2>Things to Remember When You Feel Like Everyone's Ahead of You</h2>

<h3>1. There Is No Timeline</h3>
<p>JK Rowling was rejected 12 times before Harry Potter was published. She was 32. Steve Jobs was fired from his own company at 30. Oprah was told she was "unfit for TV." Your timeline is your own. Stop comparing Chapter 1 of your story to someone else's Chapter 20.</p>

<h3>2. Being Confused Is Normal</h3>
<p>Knowing what you DON'T want is progress. Not enjoying your job? That's data. Feeling unfulfilled? That's your inner compass working. Confusion isn't failure - it's the beginning of clarity.</p>

<h3>3. You Don't Need a "Passion" to Have a Good Life</h3>
<p>Not everyone has a burning passion. Some people have quiet interests. Some people find fulfillment in relationships, not careers. Some people are still figuring it out at 40, 50, 60. There is no deadline for self-discovery.</p>

<h3>4. Small Steps > Grand Plans</h3>
<p>You don't need a 5-year plan. You need a "what can I do today that excites me even a little bit?" Maybe it's taking a free online course. Maybe it's starting that blog. Maybe it's just going outside for a walk. Small steps lead to big clarity.</p>

<h3>5. Talk About It</h3>
<p>The loneliest part of feeling lost is thinking you're the only one. You're not. Share how you feel - with a friend, on <a href="https://brainheal.in/community">Brain Heal's community</a>, or with a <a href="https://brainheal.in/therapy">therapist</a>. Sometimes another perspective is all you need to see a path you couldn't see alone.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, our therapists don't have all the answers (nobody does). But they're incredibly good at helping you ask the right questions. Think of it as a conversation that helps you see yourself more clearly. Starting at ₹111.</p>

<p><em>You're not behind. You're not broken. You're becoming.</em> 💜</p>
`
  },

  {
    slug: 'how-to-express-emotions',
    title: "Why Can't I Express My Feelings? A Guide for People Who 'Shut Down'",
    excerpt: "You want to say what you feel, but the words get stuck. So you say 'I'm fine' when you're falling apart. You swallow your anger until it turns into resentment. Sound familiar?",
    author: { name: 'Brain Heal Team', role: 'Wellness Writers' },
    date: '2026-05-22',
    category: 'Healing',
    readTime: '8 min read',
    tags: ['emotional expression', 'vulnerability', 'communication', 'emotional intelligence', 'shutting down'],
    heroImage: '',
    content: `
<p>Have you ever been in an argument and your brain just... shuts down? The words are there, somewhere, but they won't come out. So you go silent. You nod. You say "it's fine." And then you spend the next 3 hours replaying the conversation in your head, thinking of everything you SHOULD have said.</p>

<p><strong>If this is you - you're not cold, you're not emotionless, and you're definitely not broken.</strong> You're someone who never learned how to express emotions safely. And that's not your fault.</p>

<h2>Why Some of Us Struggle to Express Feelings</h2>

<h3>Childhood Conditioning</h3>
<p>If you grew up in a house where emotions were dismissed ("stop crying"), punished ("I'll give you something to cry about"), or ignored - your brain learned that emotions = danger. So it developed a defense mechanism: shutting down. It kept you safe as a child. But now, as an adult, it's sabotaging your relationships.</p>

<h3>Fear of Being "Too Much"</h3>
<p>"Don't be so sensitive." "You're overreacting." "Why are you making a big deal out of nothing?" When you hear these things enough, you start believing that your feelings are wrong. So you swallow them. Again and again. Until you don't even know what you feel anymore.</p>

<h3>Fear of Vulnerability</h3>
<p>Expressing emotions means being vulnerable. And vulnerability means someone could hurt you. If you've been hurt before (and who hasn't?), your brain builds walls. Those walls protect you, but they also isolate you.</p>

<h2>How to Start Opening Up (At Your Own Pace)</h2>

<h3>1. Start with Writing, Not Talking</h3>
<p>If speaking feels impossible, write. Journal. Write unsent letters. Text yourself what you're feeling. The goal isn't to share it with anyone - it's to practice identifying and articulating your emotions. You can't express what you can't name.</p>

<h3>2. Use "I Feel" Statements</h3>
<p>Instead of "You never listen to me" (which triggers defensiveness), try "I feel unheard when I'm talking and you're on your phone." It's not about being polite - it's about being clear without starting a war.</p>

<h3>3. Practice with Safe People</h3>
<p>You don't need to suddenly become an open book. Start with one person you trust. Share one feeling. "I felt really hurt when you said that." That's it. See how they respond. If they hold your vulnerability with care, they're safe to open up more to.</p>

<h3>4. Try Talking to a Stranger First</h3>
<p>Sometimes it's easier to be honest with someone who doesn't know you. That's why anonymous communities and therapy exist. On <a href="https://brainheal.in/community">Brain Heal's community</a>, you can share your deepest feelings without anyone knowing who you are. And with a <a href="https://brainheal.in/therapy">therapist</a>, you have a guaranteed safe space to practice being vulnerable.</p>

<h3>5. Be Patient with Yourself</h3>
<p>You didn't learn to shut down overnight, and you won't learn to open up overnight either. Every small expression is progress. Even saying "I don't know how to explain what I feel, but something is bothering me" is a step forward.</p>

<p>At <a href="https://brainheal.in/therapy"><strong>Brain Heal</strong></a>, our therapists are trained to sit with silence, to be patient while you find the words, and to never rush you. It's a space where "I don't know" is a perfectly valid answer. Starting at ₹111.</p>

<p><em>Your feelings are not too much. They're not inconvenient. They're human. And they deserve to be heard.</em> 💜</p>
`
  },
];

// Helper: Get blog post by slug
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

// Helper: Get related posts (same category, excluding current)
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const current = getBlogBySlug(currentSlug);
  if (!current) return blogPosts.slice(0, limit);
  
  const sameCategory = blogPosts.filter(
    p => p.category === current.category && p.slug !== currentSlug
  );
  const others = blogPosts.filter(
    p => p.category !== current.category && p.slug !== currentSlug
  );
  
  return [...sameCategory, ...others].slice(0, limit);
}
