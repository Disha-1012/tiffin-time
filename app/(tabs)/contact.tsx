import { View, Text, TouchableOpacity, Linking, Dimensions, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useEffect } from "react";

const { width, height } = Dimensions.get("window");
const GOLD = "#C9A96E";
const DARK = "#1A120B";

const INSTAGRAM_URL = "https://www.instagram.com/tiffin.timee/";

/* ---------------- Glow Ring ---------------- */
function GlowRing() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.15);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.25, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.28, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.08, { duration: 2200, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: height * 0.28,
          alignSelf: "center",
          width: width * 0.88,
          height: width * 0.88,
          borderRadius: width * 0.44,
          borderWidth: 1.5,
          borderColor: GOLD,
        },
        style,
      ]}
    />
  );
}

/* ---------------- Sparkle ---------------- */
function Sparkle({ i }: { i: number }) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.3 + Math.random() * 0.4);

  const topPos = Math.random() * height;
  const leftPos = Math.random() * width;
  const size = 2 + Math.random() * 3;
  const duration = 2500 + Math.random() * 3000;
  const delay = i * 100;

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      entering={FadeIn.delay(delay)}
      style={[
        {
          position: "absolute",
          top: topPos,
          left: leftPos,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: GOLD,
          opacity: opacity.value,
        },
        animStyle,
      ]}
    />
  );
}

/* ---------------- Button ---------------- */
function ShimmerButton() {
  const shimmer = useSharedValue(-1);
  const scale = useSharedValue(1);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.linear }),
      -1
    );
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(shimmer.value, [-1, 1], [-width * 0.9, width * 0.9]),
      },
    ],
    opacity: interpolate(shimmer.value, [-0.5, 0, 0.5], [0, 0.35, 0]),
  }));

  return (
    <Animated.View entering={FadeInUp.delay(500).springify()} style={{ width: "100%" }}>
      <TouchableOpacity
        style={styles.callButton}
        onPress={() => Linking.openURL(INSTAGRAM_URL)}
      >
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
        <Text style={styles.callButtonText}>Message Now</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

/* ---------------- Main ---------------- */
export default function Contact() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      
      {/* 🔥 UPDATED LOGO */}
      <Animated.View entering={FadeInDown.duration(600)} style={styles.logoRow}>
        <Image
          source={require("../../assets/images/Logo.png")}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Tiffin Time</Text>
      </Animated.View>

      {Array.from({ length: 20 }).map((_, i) => (
        <Sparkle key={i} i={i} />
      ))}

      <GlowRing />

      <Animated.Text entering={FadeInDown.delay(100).springify()} style={styles.title}>
        Reach Us
      </Animated.Text>

      <Animated.View entering={ZoomIn.delay(200)} style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerDot}>✦</Text>
        <View style={styles.dividerLine} />
      </Animated.View>

      {/* 🔥 UPDATED CARD ROW */}
      <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.card}>
        
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>Instagram</Text>

          <TouchableOpacity onPress={() => Linking.openURL(INSTAGRAM_URL)}>
            <Text style={styles.linkText}>@tiffin.timee</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tagline}>
          Serving nostalgia with every bite 💛
        </Text>
      </Animated.View>

      <ShimmerButton />

      <TouchableOpacity onPress={() => router.push("/")} style={styles.backBtn}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
    alignItems: "center",
    padding: 20,
  },

  /* 🔥 BIGGER LOGO */
  logoRow: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,  // increased
    height: 50,
  },
  logoText: {
    color: GOLD,
    fontSize: 22, // increased
    fontWeight: "bold",
    marginLeft: 10,
  },

  title: {
    fontSize: 34,
    color: GOLD,
    marginTop: 120,
    fontWeight: "bold",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "70%",
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#C9A96E44" },
  dividerDot: { color: GOLD, marginHorizontal: 8 },

  card: {
    width: "100%",
    backgroundColor: "#221810",
    padding: 20,
    borderRadius: 16,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardLabel: {
    color: "#F0A500",
    fontSize: 20,
  },

  linkText: {
    color: "#5EB8FF",
    textDecorationLine: "underline",
    fontSize: 14,
  },

  tagline: {
    marginTop: 12,
    color: GOLD,
    fontStyle: "italic",
  },

  callButton: {
    backgroundColor: GOLD,
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
  },

  shimmer: {
    position: "absolute",
    width: 60,
    height: "100%",
    backgroundColor: "#fff",
    opacity: 0.3,
  },

  callButtonText: {
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },

  backBtn: {
    marginTop: 30,
  },

  backText: {
    color: GOLD,
  },
});