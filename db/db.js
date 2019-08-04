var db  = function database(){
    var sqlite3 = require("sqlite3").verbose();

    var db = new sqlite3.Database("./db/newsApp.db");
    
    db.serialize(() => {
    
        db.run("CREATE TABLE IF NOT EXISTS articles(user_id TEXT, title TEXT, category TEXT, content TEXT)", (err) => {
            if(err){
              console.log(err.message);
            }
          });
    
          db.run("CREATE TABLE IF NOT EXISTS users(username TEXT, password TEXT, role TEXT)", (err) => {
            if(err){
              console.log(err.message);
            }
          });

          // seeds for db

          // Science articles
          db.run("INSERT INTO articles values(?,?,?,?)", ["Ashely", "Ancient star discovery sheds light on Big Bang mystery", "Science", "On the other side of the Milky Way galaxy, astronomers have discovered an ancient star that contains evidence of the very first stars formed after the Big Bang. The red giant star is 35,000 light-years from Earth, in the Milky Way's halo. The unique thing about it is what it's missing: iron. Researchers used the SkyMapper Telescope at the Siding Spring Observatory in New South Wales, Australia, to find the star."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Megan", "Words’ meanings mapped in the brain", "Science", "In the brain, language pops up everywhere. All across the wrinkly expanse of the brain’s outer layer, a constellation of different regions handle the meaning of language. One region that responds to the words family, home and mother, for example, rests in a tiny chunk of tissue on the right side of the brain, above and behind the ear. That region and others were revealed by an intricate new map that charts the location of hundreds of areas that respond to words with related meanings. Such a detailed map hints that humans comprehend language in a way that’s much more complicated and involves many more brain areas than scientists previously thought, says Stanford University neuroscientist Russell Poldrack."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Jason", "A lightweight glove allow users to ‘feel’ objects in virtual reality", "Science", "Virtual reality (VR) seems so lifelike until you try to reach out and touch something. Now, researchers have solved this tactile problem with a new kind of glove that allows wearers to actually feel objects in their artificial environments without clunky machines weighing down their arms. Existing VR gloves mostly allow the users to feel the texture of an object using vibrations. They don’t sense shape, or they require heavy motors or air compressors to put pressure on the users’ hands to do so. In the new study, researchers wanted to make a light, nonrestrictive glove with an open palm that felt natural to wear, while providing realistic feedback when the user touched a virtual object."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Josh", "Einstein's general relativity theory is questioned but still stands for now", "Science", "More than 100 years after Albert Einstein published his iconic theory of general relativity, it is beginning to fray at the edges, said Andrea Ghez, UCLA professor of physics and astronomy. Now, in the most comprehensive test of general relativity near the monstrous black hole at the center of our galaxy, Ghez and her research team reported that Einstein's theory of general relativity holds up. Einstein's right, at least for now, said Ghez, a co-lead author of the research. We can absolutely rule out Newton's law of gravity. Our observations are consistent with Einstein's theory of general relativity. However, his theory is definitely showing vulnerability. It cannot fully explain gravity inside a black hole, and at some point we will need to move beyond Einstein's theory to a more comprehensive theory of gravity that explains what a black hole is."], (err) => {
            if(err){
              console.log(err.message);
            }
          })

          // Entertainment articles
          db.run("INSERT INTO articles values(?,?,?,?)", ["Blake", "This Is Everything the Pentagon Traded for a First Look at Top Gun: Maverick", "Entertainment", "The world is abuzz for the new trailer for Top Gun: Maverick that dropped during the San Diego Comic-Con and no one is more curious than the United States Department of Defense, who lent considerable support to the film's production. And why not? The first Top Gun was quite possibly the Navy's best tool for recruiting new sailors since the draft. But support from the Pentagon didn't come without some strings attached (it never does). In exchange for support from the DoD, the film's producers and Paramount Pictures had to agree to give the top brass an exclusive screening before the film is made public. Not a bad exchange."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Dan", "The Walking Dead Spinoff Working Title & Plot Details Revealed", "Entertainment", "The newest Walking Dead spinoff has a working title and plot details have been revealed. The comic book that spawned the The Walking Dead may have come to an end earlier this year, but the TWD television franchise continues on, and indeed is set for another expansion. Season 10 of the flagship show is set to debut in October, and promises to feature a war against the villainous Whisperers. Meanwhile, the show’s first spinoff series, Fear the Walking Dead also continues on, with season 5 currently underway. In addition to those two shows, The Walking Dead will get a feature film centered on departed series character Rick Grimes, with Universal Pictures distributing the movie to theaters. There will also be a third Walking Dead series, centered on a pair of young female protagonists and dealing with the first generation of young people to come-of-age in the zombie apocalypse."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Andrea", "How Virtual Reality Aided The Lion King 2019's Visual Effects", "Entertainment", "As Disney’s The Lion King remake sweeps across theaters worldwide, one of its most memorable aspects is the stunning animation. Thanks to extensive location scouting and cutting-edge virtual reality tech, animators and visual effects artists were able to craft a world so real that audiences felt they were actually part of it. That’s no coincidence, seeing as those same animators had to be part of the VR simulation while they were building the sets and designs for The Lion King. During an early set visit to the soundstage of Disney’s latest hit, we learned just how painstaking the process of creating Simba’s savannah really was. Visual effects supervisor Rob Legato is no stranger to complicated universes, having previously worked not only on The Jungle Book but also Avatar. He was adamant about emphasizing the human imprint in his work, which is why the immersive aspect of the VR technology was so important. My problem with doing visual effects from the beginning is it’s so impersonal. And it’s such a long process that you don’t get an emotional reaction for something you do on a stage, he admitted."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Sandy", "Dungeons & Dragons Movie Reboot Lines Up Game Night Directors", "Entertainment", "Game Night filmmakers John Francis Daley and Jonathan Goldstein are in talks to direct Paramount's Dungeons & Dragons movie reboot. The classic fantasy tabletop role-playing game Dungeons & Dragons essentially ushered in the modern era of role-playing games when it was first published in 1974, and has continued to be major part of that relatively niche culture ever since. Unsurprisingly, Hollywood has already tried to cash-in on its popularity once before; the result, however, was the infamously campy box office misfire that was 2000's D&D live-action film. Warner Bros. later made plans to reboot the Dungeons & Dragons movies in 2015, with Baby Driver's Ansel Elgort starring and Rob Letterman (Detective Pikachu) directing. Things didn't work out, though, and the reboot moved over to Paramount in 2017, after Sweetpea Entertainment and Hasbro reached a deal over the sequel rights. The LEGO Batman Movie helmsman Chris McKay was subsequently attached to direct the film in February 2018, but has since stepped away from the project."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          // Travel articles
          db.run("INSERT INTO articles values(?,?,?,?)", ["Jackie ", "The World's First Guitar-shaped Hotel Is Now Accepting Reservations", "Travel", "The door to living out your rock ‘n’ roll fantasy is about to swing open. The Hard Rock Hotel in Hollywood, Florida also known as the world’s first guitar-shaped hotel will start taking reservations this week, and you might want to mark your calendar. The new, $1.5 billion Seminole Hard Rock Hollywood is one of the most unique Hard Rock locations to date, as it will feature 1,271 luxury guest rooms and suites, including 638 rooms inside a part of the building that is shaped like a giant guitar. If you’ve ever wondered what it was like to feel like a very, very tiny rock star, here’s your chance."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Tyler", "Why Pensacola Is Perfect for a Family Vacation", "Travel", "You would think after visiting upwards of a dozen different Florida beach towns in a year, they would all start to look the same. We’re used to east coast beaches, though, so taking a vacation to Pensacola on Florida’s Emerald Coast was like stepping into another world. Naturally, the beaches are different from Atlantic beaches, with their sugary bleached-white sand and calm Gulf of Mexico water, but the entire look and feel of the town were unique. With a history as old and rich as St. Augustine, pristine natural settings and the influence of the Naval Air Station, this sunny Florida city is a must-visit for families who want a relaxing beach vacation sprinkled with education and outdoor fun."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Emily", "Paris Grapples With Mass Tourism Amid Growing Local Hostility", "Travel", "Every day on Boulevard Saint-Michel, near the Notre-Dame Cathedral in the heart of Paris’s Latin Quarter, buses unload thousands of tourists. Armed with selfie sticks, they clog up traffic and jostle with locals trying to get on with their lives. Saint-Michel is a typical location for tourists and on some evenings it gets really hard, There are so many groups and they can be very noisy and even dirty, said Arnaldo Gomes, a 70-year-old building superintendent who’s been living in the area since 1974. Parisians are used to tourists, but mass tourism where groups move in packs is beginning to annoy the residents of the City of Love, especially around landmarks like Notre Dame, the Eiffel Tower, and the Louvre museum. Although the backlash against such tourists is nowhere near as severe as in Venice and Barcelona, many in the French capital are calling on the local government to better manage flows."], (err) => {
            if(err){
              console.log(err.message);
            }
          });

          db.run("INSERT INTO articles values(?,?,?,?)", ["Johnny", "Iceland to Lure Tourists With a Mediterranean-Style Resort", "Travel", "One Icelander has come up with a daring plan to stoke tourism and make life a little more enjoyable for the locals: heated biodomes to grow exotic food and provide comfort. Winter doesn’t just come to the North Atlantic island, it stays for nine months, contributing to a high usage of anti-depressants and providing limited opportunities for farming. But the country with the northernmost capital city in the world also has plenty of free space and, crucially, lots of volcanic heat stored underground. Hjordis Sigurdardottir, an architect and chief executive officer at Spor i sandinn ehf, now wants to take advantage of all that geothermal power and build three domes, with the largest reaching almost a football field in length and spanning a total of six stories above and below ground."], (err) => {
            if(err){
              console.log(err.message);
            }
          });
    });
    
    db.close();
};

module.exports = {
    db: db
};