import Time "mo:core/Time";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type MessageId = Nat;
  type Category = Text;
  type BadgeId = Nat;

  type EncouragementMessage = {
    id : MessageId;
    text : Text;
    category : Category;
  };

  type RewardBadge = {
    id : BadgeId;
    name : Text;
    description : Text;
  };

  type UserStats = {
    messagesViewed : Nat;
    lastViewedTimestamp : Time.Time;
    badgesEarned : [BadgeId];
  };

  public type UserProfile = {
    name : Text;
    favorites : [MessageId];
    stats : UserStats;
  };

  // Built-in pool of daily encouragement messages
  let dailyEncouragementPool : [Text] = [
    "You are capable of amazing things!",
    "Every day is a new beginning!",
    "Keep going, great things take time.",
    "Believe in yourself and all that you are.",
    "You have the power to create change.",
    "Small steps every day lead to big results.",
    "Stay positive, work hard, make it happen.",
    "Your potential is limitless.",
    "Difficult roads often lead to beautiful destinations.",
    "Whatever you do, do it well.",
    "Each day is a new opportunity to grow.",
    "Stay focused and never give up.",
    "Your future is created by what you do today.",
    "Challenges are what make life interesting.",
    "Success is not final, failure is not fatal.",
    "The best is yet to come.",
    "Trust the process and enjoy the journey.",
    "You are stronger than you think.",
    "Consistency is key to success.",
    "Celebrate your progress, no matter how small.",
    "Keep moving forward, even if it's slow.",
    "Your attitude determines your direction.",
    "You are the author of your own story.",
    "Let go of what you can't control.",
    "Progress, not perfection.",
    "You are enough just as you are.",
    "Dream big, work hard, stay humble.",
    "Turn your wounds into wisdom.",
    "Take the risk or lose the chance.",
    "Embrace the glorious mess that you are.",
    "Don't wait for opportunity, create it.",
    "Happiness is a journey, not a destination.",
    "What you think, you become.",
    "Stay curious and keep learning.",
    "Doubt kills more dreams than failure ever will.",
    "Your mindset is your superpower.",
    "Keep your face always toward the sunshine.",
    "You are braver than you believe.",
    "The only limit is the one you set yourself.",
    "Be a voice, not an echo.",
    "Stars can't shine without darkness.",
    "Make each day your masterpiece.",
    "What you seek is seeking you.",
    "Do something today that your future self will thank you for.",
    "Difficulties make you stronger.",
    "You've got this! Believe it.",
    "Your energy is contagious - spread positivity.",
    "Be the reason someone smiles today.",
    "Progress is progress, no matter how small.",
    "Stay strong, your breakthrough is near.",
  ];

  let encouragementMessages = Map.empty<MessageId, EncouragementMessage>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let rewardBadges = Map.empty<BadgeId, RewardBadge>();
  var nextMessageId : MessageId = 0;
  var nextBadgeId : BadgeId = 0;
  var rewardThreshold : Nat = 5;

  // Public query - accessible to all including guests
  public query ({ caller }) func getTodayEncouragement() : async Text {
    let dayIndex = (Int.abs(Time.now() / 86_400_000_000_000) % dailyEncouragementPool.size()).toNat();
    dailyEncouragementPool[dayIndex];
  };

  // Message Management (Admin-only)
  public shared ({ caller }) func addEncouragementMessage(text : Text, category : Category) : async MessageId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add messages");
    };

    let messageId = nextMessageId;
    let message : EncouragementMessage = {
      id = messageId;
      text;
      category;
    };

    encouragementMessages.add(messageId, message);
    nextMessageId += 1;
    messageId;
  };

  public shared ({ caller }) func addRewardBadge(name : Text, description : Text) : async BadgeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add badges");
    };

    let badgeId = nextBadgeId;
    let badge : RewardBadge = {
      id = badgeId;
      name;
      description;
    };

    rewardBadges.add(badgeId, badge);
    nextBadgeId += 1;
    badgeId;
  };

  // Query methods (public - accessible to all including guests)
  public query ({ caller }) func getEncouragementMessages() : async [EncouragementMessage] {
    let msgs = encouragementMessages.values().toArray();
    if (msgs.size() > 0) { return msgs };

    // Safety fallback for users: Return daily pool converted to messages
    let fallbackMessages = dailyEncouragementPool.sliceToArray(0, 5);
    let transformedMessages = fallbackMessages.enumerate().map(func((i, msg)) { { id = i; text = msg; category = "general" } });
    transformedMessages.toArray();
  };

  public query ({ caller }) func getMessagesByCategory(category : Category) : async [EncouragementMessage] {
    encouragementMessages.values().toArray().filter(
      func(m) { m.category == category }
    );
  };

  public query ({ caller }) func getRewardBadges() : async [RewardBadge] {
    rewardBadges.values().toArray();
  };

  // Helper function to get or create user profile
  func getOrCreateUserProfile(principal : Principal) : UserProfile {
    switch (userProfiles.get(principal)) {
      case (null) {
        {
          name = "";
          favorites = [];
          stats = {
            messagesViewed = 0;
            lastViewedTimestamp = 0;
            badgesEarned = [];
          };
        };
      };
      case (?profile) {
        profile;
      };
    };
  };

  // User Profile Management (required by instructions)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Favorites Management (user-only)
  public shared ({ caller }) func addFavorite(messageId : MessageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };

    switch (encouragementMessages.get(messageId)) {
      case (null) { Runtime.trap("Message not found") };
      case (_) {
        let userProfile = getOrCreateUserProfile(caller);

        if (userProfile.favorites.any(func(id) { id == messageId })) {
          Runtime.trap("Already a favorite");
        };

        userProfiles.add(
          caller,
          {
            name = userProfile.name;
            favorites = userProfile.favorites.concat([messageId]);
            stats = userProfile.stats;
          },
        );
      };
    };
  };

  public shared ({ caller }) func removeFavorite(messageId : MessageId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };

    let userProfile = getOrCreateUserProfile(caller);

    userProfiles.add(
      caller,
      {
        name = userProfile.name;
        favorites = userProfile.favorites.filter(
          func(id) { id != messageId }
        );
        stats = userProfile.stats;
      },
    );
  };

  public query ({ caller }) func getUserFavorites() : async [EncouragementMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };

    switch (userProfiles.get(caller)) {
      case (null) { [] };
      case (?profile) {
        profile.favorites.map(
          func(messageId : MessageId) : ?EncouragementMessage {
            encouragementMessages.get(messageId);
          }
        ).filter(
          func(maybeMsg : ?EncouragementMessage) : Bool {
            switch (maybeMsg) {
              case (null) { false };
              case (?_) { true };
            };
          }
        ).map(
          func(maybeMsg : ?EncouragementMessage) : EncouragementMessage {
            switch (maybeMsg) {
              case (?msg) { msg };
              case (null) { Runtime.trap("Unexpected null message") };
            };
          }
        );
      };
    };
  };

  // Stats Management (user-only)
  public shared ({ caller }) func updateStats() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update stats");
    };

    let userProfile = getOrCreateUserProfile(caller);
    let newStats = {
      messagesViewed = userProfile.stats.messagesViewed + 1;
      lastViewedTimestamp = Time.now();
      badgesEarned = userProfile.stats.badgesEarned;
    };
    userProfiles.add(
      caller,
      {
        name = userProfile.name;
        favorites = userProfile.favorites;
        stats = newStats;
      },
    );

    let shouldReward = newStats.messagesViewed % rewardThreshold == 0;
    shouldReward;
  };

  public shared ({ caller }) func claimReward(badgeId : BadgeId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can claim rewards");
    };

    switch (rewardBadges.get(badgeId)) {
      case (null) { Runtime.trap("Badge not found") };
      case (_) {
        let userProfile = getOrCreateUserProfile(caller);
        let alreadyEarned = userProfile.stats.badgesEarned.any(
          func(bId) { bId == badgeId }
        );
        if (alreadyEarned) {
          Runtime.trap("Badge already claimed");
        };
        let updatedStats = {
          messagesViewed = userProfile.stats.messagesViewed;
          lastViewedTimestamp = userProfile.stats.lastViewedTimestamp;
          badgesEarned = userProfile.stats.badgesEarned.concat([badgeId]);
        };
        userProfiles.add(
          caller,
          {
            name = userProfile.name;
            favorites = userProfile.favorites;
            stats = updatedStats;
          },
        );
      };
    };
  };

  public query ({ caller }) func getUserStats() : async UserStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stats");
    };
    let userProfile = getOrCreateUserProfile(caller);
    userProfile.stats;
  };
};

