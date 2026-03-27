import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from "react-native-reanimated";

const GOLD = "#C9A96E";
const GOLD_BRIGHT = "#FFE5A0";
const GOLD_LIGHT = "#F0D9A8";
const DARK = "#1A120B";
const CARD = "#221810";
const SURFACE = "#2A1F14";

/* 🔶 PULSING DIVIDER DOT */
function PulsingDot() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dividerDot, animStyle]} />;
}

/* 🔶 FLOATING PARTICLE */
function FloatingParticle({ delay, x }: { delay: number; x: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.6, { duration: 600 }),
          withTiming(0, { duration: 1400 })
        ),
        -1,
        false
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-55, { duration: 2000, easing: Easing.out(Easing.quad) }),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { left: x },
        animStyle,
      ]}
    />
  );
}

export default function Cart() {
  const params = useLocalSearchParams();
  const router = useRouter();

  const total = params.totalPrice || params.price;

  /* 🔶 Animations */
  const headerY = useSharedValue(-25);
  const headerOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.88);
  const cardBorderOpacity = useSharedValue(0.1);
  const placeOrderScale = useSharedValue(1);
  const shimmerX = useSharedValue(-100);
  const totalGlow = useSharedValue(1);

  useEffect(() => {
    headerY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerOpacity.value = withTiming(1, { duration: 600 });

    titleScale.value = withDelay(100, withSpring(1, { damping: 10, stiffness: 160 }));

    cardBorderOpacity.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.12, { duration: 1600, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );

    shimmerX.value = withDelay(
      1400,
      withRepeat(
        withTiming(340, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
        -1,
        false
      )
    );

    totalGlow.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1.06, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
  }, []);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  const cardBorderAnimStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(201,169,110,${cardBorderOpacity.value})`,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const totalGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: totalGlow.value }],
  }));

  const handlePlaceOrderPressIn = () => {
    placeOrderScale.value = withTiming(0.95, { duration: 80 });
  };
  const handlePlaceOrderPressOut = () => {
    placeOrderScale.value = withSpring(1, { damping: 8, stiffness: 200 });
  };
  const placeOrderAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: placeOrderScale.value }],
  }));

  return (
    <View style={styles.container}>

      {/* 🔶 Gold top accent strip */}
      <View style={styles.topStrip} />

      {/* 🔶 Floating particles above CTA zone */}
      <View style={styles.particleContainer} pointerEvents="none">
        {[30, 70, 120, 180, 230, 280].map((x, i) => (
          <FloatingParticle key={i} x={x} delay={i * 340} />
        ))}
      </View>

      {/* 🔝 HEADER WITH LOGO */}
      <Animated.View style={[styles.header, headerAnimStyle]}>
        <View style={styles.logoRing}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headerText}>Tiffin Time</Text>
      </Animated.View>

      {/* 🔶 Title */}
      <Animated.View style={[styles.titleWrapper, titleAnimStyle]}>
        <Animated.Text
          entering={FadeIn.duration(700)}
          style={styles.titleText}
        >
          Your Order
        </Animated.Text>
        <View style={styles.titleOrnament}>
          <View style={styles.ornamentLine} />
          <PulsingDot />
          <View style={styles.ornamentLine} />
        </View>
      </Animated.View>

      {/* 🔶 Order Card */}
      <Animated.View
        entering={FadeIn.delay(300).duration(700)}
        style={[styles.card, cardBorderAnimStyle]}
      >
        {/* Top shine */}
        <View style={styles.cardShine} />

        {/* Product name row */}
        <View style={styles.cardRow}>
          <Text style={styles.cardRowLabel}>ITEM</Text>
          <Text style={styles.productName}>{params.name}</Text>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <PulsingDot />
          <View style={styles.dividerLine} />
        </View>

        {/* Spice row */}
        <View style={styles.cardRow}>
          <Text style={styles.cardRowLabel}>SPICE</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{params.spice}</Text>
          </View>
        </View>

        {/* Extra masala row */}
        <View style={[styles.cardRow, { marginTop: 10 }]}>
          <Text style={styles.cardRowLabel}>EXTRA MASALA</Text>
          <View style={[
            styles.badge,
            params.extra === "Yes" && styles.badgeActive,
          ]}>
            <Text style={[
              styles.badgeText,
              params.extra === "Yes" && styles.badgeTextActive,
            ]}>
              {params.extra}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.dividerRow, { marginTop: 14 }]}>
          <View style={styles.dividerLine} />
          <PulsingDot />
          <View style={styles.dividerLine} />
        </View>

        {/* Total row */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Animated.Text style={[styles.totalValue, totalGlowStyle]}>
            ₹{total}
          </Animated.Text>
        </View>
      </Animated.View>

      {/* 🔶 Nostalgia Message */}
      <Animated.View
        entering={FadeIn.delay(700).duration(700)}
        style={styles.nostalgiaWrapper}
      >
        <View style={styles.nostalgiaInner}>
          <Text style={styles.nostalgiaText}>
            "₹10 happiness, now in your hands 💛"
          </Text>
        </View>
      </Animated.View>

      {/* 🔶 Place Order Button */}
      <Animated.View
        entering={FadeIn.delay(1000).duration(700)}
        style={placeOrderAnimStyle}
      >
        <TouchableOpacity
          style={styles.ctaButton}
          activeOpacity={1}
          onPressIn={handlePlaceOrderPressIn}
          onPressOut={handlePlaceOrderPressOut}
          onPress={() => alert("Order Placed ✨")}
        >
          <View style={styles.ctaShine} />
          <Animated.View style={[styles.ctaShimmer, shimmerStyle]} />
          <Text style={styles.ctaText}>Place Order</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* 🔶 Back Button */}
      <Animated.View entering={FadeIn.delay(1200).duration(600)}>
        <TouchableOpacity
          onPress={() => router.push("/")}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
    padding: 20,
  },
  topStrip: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: GOLD,
    opacity: 0.9,
  },
  particleContainer: {
    position: "absolute",
    bottom: 130,
    left: 0,
    right: 0,
    height: 60,
  },
  particle: {
    position: "absolute",
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: GOLD,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    marginTop: 10,
  },
  logoRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#C9A96E66",
    shadowColor: GOLD,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 19,
    resizeMode: "contain",
  },
  headerText: {
    color: GOLD,
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  titleWrapper: {
    alignItems: "center",
    marginBottom: 4,
  },
  titleText: {
    fontSize: 26,
    color: GOLD,
    fontWeight: "bold",
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  titleOrnament: {
    flexDirection: "row",
    alignItems: "center",
    width: 140,
    marginBottom: 6,
  },
  ornamentLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#C9A96E33",
  },
  dividerDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: GOLD,
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: CARD,
    padding: 20,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#C9A96E22",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  cardShine: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "#fff",
    opacity: 0.06,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardRowLabel: {
    color: "#D4AA72",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.1,
  },
  productName: {
    color: GOLD_LIGHT,
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: SURFACE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C9A96E33",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeActive: {
    backgroundColor: "#3B2912",
    borderColor: GOLD,
  },
  badgeText: {
    color: "#D6BB87",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  badgeTextActive: {
    color: GOLD_BRIGHT,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#C9A96E22",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  totalLabel: {
    color: "#D4AA72",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  totalValue: {
    color: GOLD_BRIGHT,
    fontSize: 24,
    fontWeight: "bold",
  },
  nostalgiaWrapper: {
    marginTop: 22,
    alignItems: "center",
  },
  nostalgiaInner: {
    borderWidth: 1,
    borderColor: "#C9A96E22",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#1E1509",
  },
  nostalgiaText: {
    textAlign: "center",
    color: GOLD_LIGHT,
    fontStyle: "italic",
    fontSize: 14,
    letterSpacing: 0.3,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: GOLD,
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: GOLD,
    shadowOpacity: 0.4,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
  },
  ctaShine: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    backgroundColor: "#fff",
    opacity: 0.3,
    borderRadius: 1,
  },
  ctaShimmer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 55,
    backgroundColor: "#fff",
    opacity: 0.13,
    borderRadius: 4,
    transform: [{ skewX: "-18deg" }],
  },
  ctaText: {
    textAlign: "center",
    color: "#1A120B",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.8,
  },
  backButton: {
    marginTop: 14,
    paddingVertical: 8,
    alignItems: "center",
  },

  // 🔶 Brighter: was "#C9A96E99", now "#C9A96ECC"
  backButtonText: {
    color: "#C9A96ECC",
    fontSize: 14,
    letterSpacing: 0.5,
    fontWeight: "500",
  },
});