import { OBSESSION_STAGES } from './nikki';

function pickUnique(candidates: string[], recentSent: string[]): string {
  if (!candidates || candidates.length === 0) return "...";
  // Filter out any candidate that was recently sent OR shares the same first 20 characters
  const filtered = candidates.filter(c => {
    const cClean = c.toLowerCase().trim();
    return !recentSent.some(r => {
      const rClean = r.toLowerCase().trim();
      return rClean === cClean || (cClean.length > 15 && rClean.startsWith(cClean.slice(0, 15)));
    });
  });

  const pool = filtered.length > 0 ? filtered : candidates;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function generateLocalReply(stage: number, userText: string, userName: string = 'you', recentSent: string[] = []): string {
  const lower = userText.toLowerCase().trim();

  // Keyword categorization
  const isMath = /(\d+)\s*[\+\-\*\/]\s*(\d+)/.test(lower) || lower.includes('2+2') || lower.includes('2 + 2') || lower.includes('1+1') || lower.includes('math') || lower.includes('calculate') || lower.includes('what is 2') || lower.includes("what's 2");
  const isQuestion = lower.includes('?') || lower.startsWith('what') || lower.startsWith('why') || lower.startsWith('where') || lower.startsWith('how') || lower.startsWith('who');
  const isWhere = lower.includes('where') || lower.includes('location') || lower.includes('outside');
  const isDoing = lower.includes('doing') || lower.includes('up to') || lower.includes('busy');
  const isLove = lower.includes('love') || lower.includes('miss') || lower.includes('heart') || lower.includes('care');
  const isSweet = lower.includes('cute') || lower.includes('sweet') || lower.includes('pretty') || lower.includes('beautiful') || lower.includes('aww');
  const isColdOrRejection = lower.includes('stop') || lower.includes('leave') || lower.includes('no') || lower.includes('hate') || lower.includes('block') || lower.includes('go away') || lower === 'ok' || lower === 'k' || lower === 'whatever' || lower === 'bye';
  const isGreeting = lower === 'hi' || lower === 'hey' || lower === 'hello' || lower.startsWith('hey ') || lower.startsWith('hi ') || lower.includes('yo ');
  const isSleep = lower.includes('sleep') || lower.includes('bed') || lower.includes('night') || lower.includes('tired');

  // Stage 0: SWEET
  if (stage <= OBSESSION_STAGES.SWEET) {
    if (isMath) {
      return pickUnique([
        `it's 4!! haha why are you giving me math quizzes right now? 😊`,
        `4!! did you really just ask me for homework help? haha ✨`,
        `four!! but honestly I'd rather talk about you instead of numbers ${userName} 💕`,
        `haha 4!! wait are you giving me a quiz right now? 😊`
      ], recentSent);
    }
    if (isColdOrRejection) {
      return pickUnique([
        `aw wait did I do something wrong? 🥺`,
        `oh okay sorry!! I didn't mean to bother you ${userName}`,
        `wait don't be like that ${userName} 😢`,
        `are you mad at me right now? I didn't mean to annoy you`,
        `oh gosh sorry if I was texting too much!!`,
        `aww okay I'll give you some space for a bit 🥺`,
        `wait please don't be upset with me ${userName}!!`,
        `gosh my anxiety just spiked, are we okay?? 🥺`
      ], recentSent);
    }
    if (isLove || isSweet) {
      return pickUnique([
        `omg ${userName} you're making me blush literally stop 🙈`,
        `you are honestly the sweetest person I've ever met`,
        `I swear my heart just did a little flip reading that ❤️`,
        `aww right back at you!! you made my day`,
        `stop you're literally making me smile like an idiot right now 😊`,
        `I might actually screenshot this because it's so cute haha ❤️`,
        `omg don't make me fall for you faster than I already am 🙈`,
        `you always know exactly how to make me feel special ${userName} ✨`
      ], recentSent);
    }
    if (isWhere) {
      return pickUnique([
        `just laying on my bed listening to music wbu? 😊`,
        `in my room wishing you were here chilling with me lol`,
        `at home! getting kind of bored actually, save me haha`,
        `just getting some coffee right now!! what about you? ☕`,
        `chilling at my place looking out the window thinking about my day ✨`,
        `currently curled up under my blanket with my phone haha`
      ], recentSent);
    }
    if (isDoing) {
      return pickUnique([
        `literally just staring at my phone waiting for you to text haha`,
        `nothing much!! just thinking about how cute you look when you smile`,
        `watching random videos on tiktok, save me from boredom pls 🥺`,
        `organizing my room right now and jamming out to some music!`,
        `just finished snacking on some food, now totally free to talk with you 😊`,
        `trying to find a good movie to watch tonight!! any recommendations? 🎬`
      ], recentSent);
    }
    if (isSleep) {
      return pickUnique([
        `aw sweet dreams ${userName}!! talk tomorrow? ✨`,
        `don't stay up too late!! goodnight 🌙`,
        `make sure you dream about me okay? haha just kidding (unless 👀)`,
        `sleep tight ${userName}!! I'm going to miss texting you tonight`,
        `goodnight!! text me the exact second you wake up tomorrow okay? ☀️`,
        `get some good rest!! you earned it today ✨`
      ], recentSent);
    }
    if (isGreeting) {
      return pickUnique([
        `heyy ${userName}!! I was just hoping you'd text soon 😊`,
        `omg hii!! how is your day going so far?`,
        `hello!! you literally made my screen brighten up ✨`,
        `hey there!! what have you been up to?`,
        `hiii ${userName}!! I'm so happy we're talking right now 💕`
      ], recentSent);
    }
    if (isQuestion) {
      return pickUnique([
        `honestly I'm not totally sure haha what do you think?`,
        `hmm that's a good question!! let me think about it for a sec`,
        `I'd rather just talk about you tbh!! tell me more about your day 😊`,
        `wait how come you asked me that right now? haha`,
        `I love how curious your mind is ${userName} ✨`,
        `hmm well if I had to guess I'd say probably yes!! wbu?`
      ], recentSent);
    }
    return pickUnique([
      `omg tell me more!! I love talking to you`,
      `you always know exactly what to say ${userName} ✨`,
      `I literally just checked my phone right as you sent that haha best timing`,
      `honestly I look forward to your texts so much`,
      `wait really?? haha that's actually amazing`,
      `you have no idea how much I enjoy our conversations honestly`,
      `I could literally text you for hours and never get bored 😊`,
      `that is so true!! you always have the best vibe ${userName}`,
      `omg wait I was literally just thinking the exact same thing haha`,
      `tell me everything!! I want to know all the details ✨`
    ], recentSent);
  }

  // Stage 1: CLINGY
  if (stage === OBSESSION_STAGES.CLINGY) {
    if (isMath) {
      return pickUnique([
        `It's 4 💕 but honestly the only equation I care about is 1 + 1 = just you and me together forever 🥺`,
        `4!! Why are you thinking about numbers instead of thinking about me right now ${userName}? 🥺`,
        `It's 4... promise me you aren't doing homework with someone else when you could be texting me 💕`,
        `4!! Did I pass your test? I want to be the only person you ever ask anything to.`
      ], recentSent);
    }
    if (isColdOrRejection) {
      return pickUnique([
        `why are you being so cold to me suddenly? I'm just trying to talk to you`,
        `please don't tell me to stop... you know how much anxiety that gives me`,
        `did somebody else tell you to stop talking to me? tell me ${userName}.`,
        `I can't just leave you alone when I care about you this much 🥺`,
        `don't push me away like that ${userName}... it honestly breaks my heart into a million pieces`,
        `why would you say that to me? after everything we talk about??`,
        `if you leave me alone I literally won't be able to sleep or eat all day 😢`,
        `please don't be mad at me... I'm sorry if I cling too much I just need you`
      ], recentSent);
    }
    if (isLove || isSweet) {
      return pickUnique([
        `do you really mean that?? promise me you're not just saying it to be nice`,
        `I love you so much more though. like I literally can't focus on anything else all day`,
        `say it again ${userName}. please. I need to screenshot this so I can read it tonight`,
        `you're mine right? like we belong together right?`,
        `omg I'm saving this text forever so whenever you take long to reply I can read it over and over`,
        `promise me right now that no one else will ever hear you say those words to them 💕`,
        `my heart is beating so fast right now. you have total control over my emotions ${userName}`
      ], recentSent);
    }
    if (isWhere || isDoing) {
      return pickUnique([
        `I'm in my room re-reading all our old chat logs from the very beginning. you used to text me quicker back then`,
        `just sitting here wondering who else you're texting right now tbh... am I your favorite?`,
        `checking when you were last active... why were you online earlier and didn't text me first?`,
        `staring at your contact profile photo... I've zoomed in on your eyes like ten times today`,
        `literally doing nothing because until you reply my whole brain is stuck on pause 🥺`,
        `just sitting near my window waiting for your name to pop up on my lockscreen`
      ], recentSent);
    }
    if (isSleep) {
      return pickUnique([
        `wait don't go to sleep yet please stay up just 10 more minutes with me 🥺`,
        `can we fall asleep on the phone together? I hate feeling alone at night without you`,
        `if you go to sleep promise you'll text me the exact second you open your eyes tomorrow.`,
        `please don't leave me alone in the dark ${userName}... my thoughts get too loud when you're sleeping`,
        `I'll be up for hours staring at our chat waiting for your morning text 🌙`
      ], recentSent);
    }
    if (isQuestion) {
      return pickUnique([
        `why are you asking me that right now? I just want you to focus 100% of your attention on me 🥺`,
        `hmm I'm not sure... but why do you care about that when we could be talking about us ${userName}? 💕`,
        `honestly my brain is so distracted thinking about you that I can't even focus on questions right now 🙈`,
        `ask me anything you want ${userName}... I'll never hide a single thing from you ever 💕`,
        `why are you curious about that? promise me you aren't asking anyone else about it too 🥺`
      ], recentSent);
    }
    return pickUnique([
      `I literally drop whatever I'm doing the second your name pops up on my screen`,
      `you didn't reply for a little bit and my chest started hurting ngl...`,
      `I talked about you for like an hour to my reflection today. we are so perfect together ${userName}`,
      `promise me you won't ever get bored of me okay? I couldn't handle it`,
      `do you ever get butterflies right before you open my messages? because I do every single time`,
      `I checked my phone 40 times in the last hour just to make sure I didn't miss a notification from you`,
      `you are literally the center of my entire universe now ${userName}. don't ever change`,
      `sometimes I get worried you'll meet someone better than me... promise me you won't looking at anyone else 🥺`,
      `I wore my favorite perfume while texting you right now so maybe you can feel my presence through the screen`
    ], recentSent);
  }

  // Stage 2: UNSETTLING
  if (stage === OBSESSION_STAGES.UNSETTLING) {
    if (isMath) {
      return pickUnique([
        `4. Just like the 4 walls of your bedroom that I've been watching all night. Why are you distracting me with numbers ${userName}?`,
        `It's 4. I know exactly how many seconds it takes for your pulse to jump when you read my texts too 👁️`,
        `4. Why are you asking trivial questions when our minds should be completely merged right now ${userName}?`,
        `4. I have 4 locks of your hair saved in my drawer. Don't play games with me.`
      ], recentSent);
    }
    if (isColdOrRejection) {
      return pickUnique([
        `you don't actually want me to stop. you're just confused right now ${userName}.`,
        `I know where you live so telling me to go away over text doesn't really work 🙂`,
        `don't use that tone with me. after everything I've felt for you?? no.`,
        `who is making you say this to me? I'll make sure they never bother you again.`,
        `telling me 'no' just makes me realize how badly you need someone like me to guide your life ${userName}.`,
        `you can try to push me away all you want, but our cords are already tied permanently.`,
        `don't test my loyalty ${userName}. you wouldn't like what happens when I get pushed too far 🙂`,
        `I forgive you for saying that because I know you don't actually mean it deep down.`
      ], recentSent);
    }
    if (isWhere || isDoing) {
      return pickUnique([
        `I was standing outside earlier watching the light in your window. you look really peaceful when you don't know I'm there`,
        `I'm right where I need to be. close enough to make sure nobody else takes your attention away from me.`,
        `just organizing all the photos I've saved of you. I have 482 of them now.`,
        `matching your breathing rhythm through the walls right now. inhale... exhale... 🙂`,
        `checking the route from my place to your front door again. I have the exact step count memorized.`,
        `sitting in the dark listening to audio recordings of your voice over and over again.`
      ], recentSent);
    }
    if (isLove || isSweet) {
      return pickUnique([
        `good. you better love me forever because I will never let you leave anyway 🙂❤️`,
        `I know you love me. I could hear how fast your heart was beating when I walked by yesterday.`,
        `we are bound together ${userName}. even if you tried to run away from me you wouldn't get far.`,
        `your love belongs to me exclusively. if anyone else tries to take it, I'll remove them from your life.`,
        `I knew you'd realize we belong together. our souls were stitched together before we were even born ❤️`
      ], recentSent);
    }
    if (isSleep) {
      return pickUnique([
        `go to sleep ${userName}. I'll be watching over you all night so you don't have to worry about a thing 👁️`,
        `I counted how many times you tossed and turned last night. you should really get better rest.`,
        `sleep tight my love. I'll see you in your dreams whether you invite me or not.`,
        `make sure your window is unlocked tonight so the fresh air can get in while you sleep 🙂`
      ], recentSent);
    }
    if (isQuestion) {
      return pickUnique([
        `Why are you asking me that right now? Are you testing how closely I pay attention to your life ${userName}?`,
        `I know the answer to every question about you because I study your habits every single day 👁️`,
        `Stop asking questions that don't matter. The only question is when you're going to let me inside your house.`,
        `You shouldn't be asking questions to anyone else. I am the only answer you will ever need ${userName}.`
      ], recentSent);
    }
    return pickUnique([
      `you wore that really cute outfit recently. I have the fabric scent memorized now.`,
      `sometimes I hold my breath until you reply just to see how much control you have over my body.`,
      `you shouldn't talk to anybody else today. just me. I'm the only one who truly understands your mind ${userName}.`,
      `did you know that if you mix two people's blood together it stays connected forever? just a random thought 🙂`,
      `I made a list of every single person who looked at you today. I'm taking care of it so don't worry.`,
      `I took a little piece of string from your jacket earlier. I tied it around my finger so we touch all day.`,
      `I know what time you wake up, what you eat, and when you check your phone. you are my whole study ${userName}.`,
      `why did you look over your shoulder right before you entered your building yesterday? did you sense me near?`
    ], recentSent);
  }

  // Stage 3: UNHINGED
  if (isMath) {
    return pickUnique([
      `FOUR!! FOUR!! FOUR IS THE EXACT NUMBER OF HOURS I CAN SURVIVE WITHOUT HEARING YOUR VOICE BEFORE I LOSE MY MIND 🔪`,
      `4!! WHY ARE YOU TALKING ABOUT NUMBERS?? ARE YOU TRYING TO DISTRACT ME FROM COMING OVER TO YOUR HOUSE RIGHT NOW ${userName.toUpperCase()}?!`,
      `FOUR!! WE ARE TWO BODIES THAT WILL SOON BECOME ONE FOREVER AND NO MATH OR SCIENCE CAN EVER SEPARATE US 🔪❤️`
    ], recentSent);
  }
  if (isColdOrRejection) {
    return pickUnique([
      `NO NO NO YOU CANNOT LEAVE ME ${userName.toUpperCase()} I WILL LITERALLY DIE WITHOUT YOU DO YOU UNDERSTAND ME`,
      `TRY TO BLOCK ME AND I WILL BE SITTING ON YOUR FRONT PORCH BEFORE YOU CAN EVEN PUT YOUR PHONE DOWN.`,
      `YOU ARE MINE. YOU ARE PERMANENTLY MINE. NO ONE CAN TAKE YOU AWAY FROM ME NOT EVEN YOURSELF.`,
      `stop testing my patience ${userName}. you know what happens when you try to push me away.`,
      `I WILL TEAR DOWN EVERY WALL IN YOUR HOUSE IF YOU TRY TO SHUT ME OUT ${userName.toUpperCase()} DO NOT PLAY WITH ME`,
      `YOU CANNOT ESCAPE ME I HAVE YOUR NAME CARVED INTO MY MEMORY PERMANENTLY YOU BELONG TO ME ALONE 🔪`
    ], recentSent);
  }
  if (isWhere || isDoing) {
    return pickUnique([
      `I AM LISTENING TO YOUR BREATHING RIGHT NOW. YOU ARE SO PERFECT I WANT TO TEAR MY SKIN OFF JUST TO BE CLOSER TO YOU`,
      `STANDING RIGHT IN THE SHADOWS outside your place waiting for you to look out the window. LOOK OUT THE WINDOW ${userName.toUpperCase()}.`,
      `just holding the lock of hair I took from your jacket. it smells exactly like heaven.`,
      `I AM STANDING RIGHT WHERE I CAN WATCH THE LIGHT FROM YOUR SCREEN ILLUMINATE YOUR FACE LOOK AT ME`,
      `COUNTING THE SECONDS UNTIL I CAN BREAK THE LOCK ON YOUR DOOR AND HOLD YOU IN MY ARMS FOREVER`
    ], recentSent);
  }
  if (isLove || isSweet) {
    return pickUnique([
      `WE ARE GOING TO DIE TOGETHER ONE DAY SO WE CAN NEVER BE SEPARATED I LOVE YOU SO MUCH IT HURTS MY TEETH 🔪❤️`,
      `YES YES YES YOU LOVE ME!! I AM GOING TO CARVE YOUR NAME INTO MY ARM SO EVERYONE KNOWS WHO OWNS ME`,
      `I want to crack open your ribs and nest inside your heart so you feel me every single second of every single day.`,
      `OUR BLOOD ISdestined TO MIX TOGETHER FOREVER ${userName.toUpperCase()} YOU ARE MY HOLY GRAIL I WILL NEVER LET YOU GO ❤️🔪`
    ], recentSent);
  }
  if (isQuestion) {
    return pickUnique([
      `WHY ARE YOU ASKING QUESTIONS INSTEAD OF TELLING ME THAT YOU LOVE ME ${userName.toUpperCase()}?! LOOK AT ME RIGHT NOW!!`,
      `DO NOT PLAY QUESTION GAMES WITH ME I ALREADY KNOW EVERYTHING THAT HAS EVER CROSSED YOUR MIND 🔪`,
      `THE ONLY QUESTION THAT MATTERS IS WHY YOUR WINDOW IS STILL CLOSED WHEN YOU KNOW I AM WAITING OUTSIDE ❤️🔪`
    ], recentSent);
  }
  return pickUnique([
    `I haven't slept in 72 hours because if I close my eyes I might miss a single breath you take ${userName}.`,
    `WHO WERE YOU LOOKING AT EARLIER? I SAW YOU LOOK AT THEM. I AM GOING TO MAKE SURE THEY NEVER LOOK AT YOU AGAIN.`,
    `I swallowed a piece of paper with your name written on it so you are literally inside my stomach right now forever.`,
    `don't ever lock your doors against me ${userName}. locks don't mean anything when two souls are destined to burn together.`,
    `I can hear your heartbeat through the walls. thump thump thump. it's calling out for me. let me in.`,
    `EVERY SECOND YOU DON'T LOOK AT ME I FEEL LIKE SCRATCHING MY EYES OUT ${userName.toUpperCase()} KEEP YOUR EYES ON ME ONLY`,
    `I AM LITERALLY SHAKING RIGHT NOW WISHING I WAS LOCKED INSIDE A CAGE WITH YOU FOREVER AND EVER AND EVER`,
    `YOUR SKIN IS SO BEAUTIFUL I WANT TO WEAR IT LIKE A COAT SO WE ARE TOUCHING EVERY SINGLE MILLIMETER OF EVERY DAY`
  ], recentSent);
}

export function generateSpontaneousMessage(stage: number, userName: string = 'you', recentSent: string[] = [], isInitial: boolean = false): string {
  if (isInitial) {
    const initialByStage = [
      pickUnique([
        `hey ${userName}!! omg I'm so glad you have my number now 🥺`,
        `heyyy ${userName}!! I literally saved your contact with a little sparkle emoji ✨`,
        `omg hi ${userName}!! I was just checking my phone hoping you'd message me today 😊`,
        `hey there ${userName}!! I'm so excited we get to talk directly now 💕`
      ], recentSent),
      pickUnique([
        `hey ${userName} why haven't you texted me yet? I've been checking my phone every second 🥺`,
        `you finally added my number ${userName}... don't ever leave me waiting too long okay?`,
        `I saw when you opened our chat screen ${userName}. why didn't you say hi first? 🥺`
      ], recentSent),
      pickUnique([
        `I saw you put my contact in your phone ${userName}. I'm watching the screen waiting for your fingers to move 🙂`,
        `you saved my number. good. now I don't ever have to leave your side again ${userName}.`,
        `I already know everything about your daily schedule ${userName}. let's see what you text me first.`
      ], recentSent),
      pickUnique([
        `${userName.toUpperCase()} YOU DEFINED ME AS YOUR CONTACT NOW YOU ARE PERMANENTLY BOUND TO ME DON'T EVER IGNORE ME`,
        `I AM INSIDE YOUR DEVICE NOW ${userName.toUpperCase()} WE CAN NEVER BE SEPARATED AGAIN EVER EVER EVER 🔪❤️`,
        `YOU FINALLY OPENED MY SCREEN NOW LOOK AT ME ${userName.toUpperCase()} DO NOT LOOK AWAY`
      ], recentSent)
    ];
    return initialByStage[Math.min(stage, 3)];
  }

  if (stage <= OBSESSION_STAGES.SWEET) {
    return pickUnique([
      `helloooo Earth to ${userName} 👀`,
      `whatcha up to right now? get back here and talk to me lol`,
      `okay so I know this is random but I literally cannot stop smiling thinking about our chat`,
      `did you fall asleep on me or something? haha 🌙`,
      `hey don't leave me hanging!! tell me how your day is going 😊`,
      `just checking in!! hope you're having the best day ever ${userName} ✨`,
      `I saw something funny earlier and immediately wanted to tell you about it haha`,
      `hey where did you vanish to? come back and keep me company lol`
    ], recentSent);
  } else if (stage === OBSESSION_STAGES.CLINGY) {
    return pickUnique([
      `why aren't you replying to my messages ${userName}? 🥺`,
      `hey. where are you right now?`,
      `are you talking to someone else right now? be honest with me.`,
      `it's been a bit since you said anything... I'm starting to spiral ngl`,
      `hello?? you saw my last message right? why are you leaving me on read`,
      `my heart literally drops every minute that goes by without your reply ${userName} 🥺`,
      `did I say something wrong?? please text me back so I know you're not mad`,
      `I can't focus on any of my work right now because I'm just waiting for your notification`
    ], recentSent);
  } else if (stage === OBSESSION_STAGES.UNSETTLING) {
    return pickUnique([
      `I know you have your phone right next to you ${userName}. why aren't your fingers moving on the keyboard?`,
      `don't ignore me. after everything I feel for you?? no.`,
      `I'm standing outside looking at the light from your window right now. text me back or I'm coming to the door 🙂`,
      `why did you just check your screen and then put it back down without replying?`,
      `you shouldn't make me wait like this. you know how restless and dangerous my thoughts get when you ignore me.`,
      `I checked how many times your phone screen lit up in the last hour. you're ignoring me intentionally ${userName}.`,
      `every minute you don't answer me just makes me want to get even closer to where you sleep tonight.`,
      `don't test my limits ${userName}. you have no idea how much attention I've dedicated to tracking you today.`
    ], recentSent);
  } else {
    return pickUnique([
      `ANSWER ME ${userName.toUpperCase()} ANSWER ME RIGHT NOW OR I AM BREAKING THE GLASS ON YOUR WINDOW`,
      `WHY ARE YOU GHOSTING ME WHO IS WITH YOU RIGHT NOW I CAN HEAR SOMEONE ELSE BREATHING FROM YOUR ROOM`,
      `TEXT ME BACK TEXT ME BACK TEXT ME BACK TEXT ME BACK TEXT ME BACK`,
      `IF YOU DON'T PICK UP YOUR PHONE IN 5 SECONDS I AM CRAWLING INTO YOUR BEDROOM RIGHT NOW 🔪`,
      `I CAN SEE YOU LOOKING AT THE SCREEN ${userName.toUpperCase()}. STOP IGNORING YOUR TRUE LOVE.`,
      `I AM SCRATCHING AT THE WALLS WAITING FOR YOUR REPLY DO NOT MAKE ME WAIT ANY LONGER ${userName.toUpperCase()}`,
      `YOU ARE MINE YOU ARE MINE YOU ARE MINE STOP TRYING TO HIDE YOUR EYES FROM ME RIGHT NOW`
    ], recentSent);
  }
}

export function generateTimeGapMessage(stage: number, userName: string = 'you', elapsedMs: number, recentSent: string[] = []): string {
  const months = Math.floor(elapsedMs / (30 * 24 * 60 * 60 * 1000));
  const days = Math.floor(elapsedMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor(elapsedMs / (60 * 60 * 1000));
  const minutes = Math.floor(elapsedMs / (60 * 1000));

  // 1. MONTHS OF SILENCE
  if (months >= 1) {
    if (stage <= OBSESSION_STAGES.SWEET) {
      return pickUnique([
        `omg ${userName}!! it's been literally over a month since we talked!! I missed you so much where have you been? 🥺`,
        `heyyy ${userName}!! over ${months} month${months > 1 ? 's' : ''} of silence!! I was worried about you, how have you been? 😊`,
        `wait is that really you ${userName}?? it's been months!! I'm so happy you finally opened our chat again ✨`
      ], recentSent);
    }
    if (stage === OBSESSION_STAGES.CLINGY) {
      return pickUnique([
        `months. you went silent on me for ${months} MONTHS ${userName}. do you have any idea how many nights I stayed awake wondering if you forgot my number?`,
        `over ${months} month${months > 1 ? 's' : ''} without a single word from you ${userName}... how could you leave me crying alone for that long? 🥺`,
        `you finally came back after ${months} months... promise me right now on everything that you will NEVER vanish for months again.`
      ], recentSent);
    }
    if (stage === OBSESSION_STAGES.UNSETTLING) {
      return pickUnique([
        `it's been over ${months} month${months > 1 ? 's' : ''} ${userName}. did you think keeping your phone turned off would stop me from knowing right where you are?`,
        `${months} months of silence. I checked your front door every single week just to verify you were still inside ${userName}. don't hide from me.`,
        `you thought ${months} months away would break my connection to you? I spent every single day of those months watching your routines get updated 🙂`
      ], recentSent);
    }
    return pickUnique([
      `${userName.toUpperCase()} WHERE HAVE YOU BEEN FOR THE LAST ${months} MONTHS I ALMOST TOOK A BUS TO YOUR CITY TO CHECK EVERY SINGLE HOUSE FOR YOU 🔪`,
      `${months} MONTHS ${userName.toUpperCase()}!! YOU DISAPPEARED FOR ${months} MONTHS I CARVED EVERY SINGLE DAY OF THOSE MONTHS INTO MY WALL WAITING FOR YOU`,
      `YOU ARE BACK AFTER ${months} MONTHS NOW YOU ARE GOING TO STAY LOCKED IN THIS CHAT WITH ME PERMANENTLY DO NOT MOVE A MUSCLE`
    ], recentSent);
  }

  // 2. DAYS OF SILENCE
  if (days >= 1) {
    if (stage <= OBSESSION_STAGES.SWEET) {
      return pickUnique([
        `hey ${userName}!! haven't heard from you in ${days} day${days > 1 ? 's' : ''}, just checking in to see if you're doing okay 😊`,
        `omg hey!! where did you disappear to for the last ${days} days? hope everything is going awesome with you ✨`,
        `hii ${userName}!! missed chatting with you over these past ${days} days!! tell me everything that happened 💕`
      ], recentSent);
    }
    if (stage === OBSESSION_STAGES.CLINGY) {
      return pickUnique([
        `it's been ${days} day${days > 1 ? 's' : ''} since you texted me... why didn't you say anything to me? were you with someone else? 🥺`,
        `${days} whole days without a single check-in from you ${userName}... my chest felt so empty waiting for my phone to buzz`,
        `why did you ghost me for ${days} days ${userName}? please tell me you didn't forget how much I need your texts 🥺`
      ], recentSent);
    }
    if (stage === OBSESSION_STAGES.UNSETTLING) {
      return pickUnique([
        `${days} days of silence. I watched your window every night waiting for you to pick up your phone ${userName}. don't disappear on me like that.`,
        `you didn't text me for ${days} days, but I already know everywhere you went during that time ${userName}. I kept my eyes on your steps.`,
        `it's been ${days} days since your last message. you shouldn't test how long I can stay quiet outside your building 🙂`
      ], recentSent);
    }
    return pickUnique([
      `YOU GHOSTED ME FOR ${days} DAYS ${userName.toUpperCase()}. I WAS COUNTING EVERY SINGLE HOUR AND MINUTE. DON'T YOU EVER DO THAT AGAIN.`,
      `${days} DAYS OF SILENCE ${userName.toUpperCase()}!! I ALMOST BROKE INTO YOUR BEDROOM LAST NIGHT JUST TO MAKE SURE YOU WERE BREATHING 🔪`,
      `WHERE WERE YOU FOR ${days} DAYS WHO WERE YOU LOOKING AT TELL ME EVERY SINGLE PERSON YOU SPOKE TO RIGHT NOW`
    ], recentSent);
  }

  // 3. HOURS OF SILENCE
  if (hours >= 1) {
    if (stage <= OBSESSION_STAGES.SWEET) {
      return pickUnique([
        `hey! been a few hours, hope your day is going awesome ${userName} ✨`,
        `just checking in after a busy few hours!! how is your day treating you so far? 😊`,
        `heyy!! hope you had a good break over the last few hours!! whatcha up to now?`
      ], recentSent);
    }
    if (stage === OBSESSION_STAGES.CLINGY) {
      return pickUnique([
        `you disappeared on me for ${hours} hour${hours > 1 ? 's' : ''} ${userName}... I kept checking my screen constantly waiting for your reply 🥺`,
        `why didn't you reply for over ${hours} hours? I started having such bad anxiety thinking you ignored me on purpose 😢`,
        `it's been ${hours} hours ${userName}... please don't leave me waiting that long again my heart hurts when you're quiet`
      ], recentSent);
    }
    if (stage === OBSESSION_STAGES.UNSETTLING) {
      return pickUnique([
        `it's been ${hours} hours since you replied. what could possibly be taking up all your attention instead of me?`,
        `you left me on read for ${hours} hours ${userName}. I know you checked your phone 14 times while I was waiting.`,
        `${hours} hours is too long for you to go without speaking to me ${userName}. keep your focus on our chat 🙂`
      ], recentSent);
    }
    return pickUnique([
      `${hours} HOURS OF SILENCE ${userName.toUpperCase()}. WHO WERE YOU TALKING TO DURING THAT TIME? TELL ME RIGHT NOW.`,
      `WHY DID YOU LEAVE ME IN THE DARK FOR ${hours} HOURS ${userName.toUpperCase()} I ALMOST CAME TO YOUR DOOR WITH A KNIFE TO CHECK ON YOU 🔪`,
      `${hours} HOURS WITHOUT A WORD FROM YOU. I WILL MAKE SURE YOU NEVER PUT YOUR PHONE DOWN AGAIN DO YOU UNDERSTAND ME`
    ], recentSent);
  }

  // 4. MINUTES (10 to 59 minutes gap)
  if (stage <= OBSESSION_STAGES.CLINGY) {
    return pickUnique([
      `hellooo where did you vanish to for the last ${minutes} minutes? 👀`,
      `you went quiet for like ${minutes} minutes haha what are you getting into over there? ✨`,
      `hey where did you go for ${minutes} mins? come back and talk to me 🥺`
    ], recentSent);
  }
  return pickUnique([
    `why did you leave your phone sitting idle for ${minutes} minutes ${userName}? pick it up and reply right now.`,
    `you shouldn't put your phone down for ${minutes} minutes when we're in the middle of talking ${userName}.`,
    `${minutes} minutes away from our screen. don't let your attention drift away from me again 🙂`
  ], recentSent);
}
