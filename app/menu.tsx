import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
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

const menu = [
  { id: "1", name: "Masala Soda", price: 20, image: require("../assets/images/P5.png") },
  { id: "2", name: "Peyara Makha", price: 15, image: require("../assets/images/P7.png") },
  { id: "3", name: "Kancha Aam Mix", price: 20, image: require("../assets/images/P6.png") },
  { id: "4", name: "Candy Mix", price: 10, noSpice: "true", image: require("../assets/images/P4.png") },
  { id: "5", name: "Mixed Chaat", price: 30, image: require("../assets/images/P3.png") },
];

const GOLD = "#C9A96E";
const GOLD_BRIGHT = "#FFE5A0";
const GOLD_LIGHT = "#F0D9A8";
const DARK = "#1A120B";
const CARD = "#221810";

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

/* 🔶 ANIMATED MENU CARD */
function MenuItem({ item, index }: { item: typeof menu[0]; index: number }) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const imageRingScale = useSharedValue(1);
  const imageRingOpacity = useSharedValue(0.5);
  const shimmerX = useSharedValue(-80);

  useEffect(() => {
    imageRingScale.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(1.22, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
          withTiming(1.0, { duration: 1500, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      )
    );
    imageRingOpacity.value = withDelay(
      index * 200,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: 1500 }),
          withTiming(0.2, { duration: 1500 })
        ),
        -1,
        true
      )
    );

    shimmerX.value = withDelay(
      800 + index * 300,
      withRepeat(
        withTiming(320, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
        -1,
        false
      )
    );
  }, []);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const ringAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageRingScale.value }],
    opacity: imageRingOpacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 80 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 8, stiffness: 200 });
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 150).duration(500)}
      style={[styles.rowContainer, cardAnimStyle]}
    >
      {/* 🖼️ LEFT IMAGE WITH BREATHING RING */}
      <View style={styles.imageWrapper}>
        <Animated.View style={[styles.imageRing, ringAnimStyle]} />
        <Image source={item.image} style={styles.itemImage} />
      </View>

      {/* 📦 MENU CARD */}
      <TouchableOpacity
        style={styles.card}
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() =>
          router.push({
            pathname: "/product",
            params: item,
          })
        }
      >
        {/* Shimmer sweep */}
        <Animated.View style={[styles.cardShimmer, shimmerStyle]} />

        {/* Top shine line */}
        <View style={styles.cardShine} />

        <Text style={styles.itemName}>{item.name}</Text>

        {/* 🔶 Customizable Badge for Mixed Chaat */}
        {item.name === "Mixed Chaat" && (
          <View style={styles.customBadge}>
            <Text style={styles.customBadgeText}>Customizable</Text>
          </View>
        )}

        {/* 🔶 Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>₹{item.price}</Text>
        </View>

        {/* Arrow indicator */}
        <View style={styles.arrowDot}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function Menu() {
  const router = useRouter();

  const headerY = useSharedValue(-25);
  const headerOpacity = useSharedValue(0);
  const underlineWidth = useSharedValue(0);
  const titleScale = useSharedValue(0.92);

  useEffect(() => {
    headerY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    headerOpacity.value = withTiming(1, { duration: 600 });
    underlineWidth.value = withDelay(500, withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }));
    titleScale.value = withDelay(200, withSpring(1, { damping: 10, stiffness: 160 }));
  }, []);

  const headerAnimStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerY.value }],
  }));

  const underlineAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: underlineWidth.value }],
  }));

  const titleAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.topStrip} />

      <Animated.View style={[styles.header, headerAnimStyle]}>
        <View style={styles.logoRing}>
          <Image
            source={require("../assets/images/Logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headerText}>Tiffin Time</Text>
      </Animated.View>

      <Animated.View style={[styles.titleWrapper, titleAnimStyle]}>
        <Animated.Text
          entering={FadeIn.duration(700)}
          style={styles.titleText}
        >
          Explore Menu
        </Animated.Text>
        <Animated.View style={[styles.titleUnderline, underlineAnimStyle]} />
        <View style={styles.titleOrnament}>
          <View style={styles.ornamentLine} />
          <PulsingDot />
          <View style={styles.ornamentLine} />
        </View>
      </Animated.View>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item, index }) => (
          <MenuItem item={item} index={index} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK, padding: 20 },
  topStrip: { position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: GOLD, opacity: 0.9 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 22, marginTop: 10 },
  logoRing: { width: 48, height: 48, borderRadius: 24, backgroundColor: GOLD, justifyContent: "center", alignItems: "center", marginRight: 12, borderWidth: 2, borderColor: "#C9A96E66", shadowColor: GOLD, shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 0 } },
  logo: { width: 48, height: 48, borderRadius: 19, resizeMode: "contain" },
  headerText: { color: GOLD, fontSize: 22, fontWeight: "bold", letterSpacing: 1.2 },
  titleWrapper: { alignItems: "center", marginBottom: 20 },
  titleText: { fontSize: 24, color: GOLD_BRIGHT, textAlign: "center", fontWeight: "700", letterSpacing: 0.8, marginBottom: 8 },
  titleUnderline: { height: 2, width: 100, backgroundColor: GOLD, borderRadius: 2, marginBottom: 10, transformOrigin: "left" },
  titleOrnament: { flexDirection: "row", alignItems: "center", width: 160 },
  ornamentLine: { flex: 1, height: 1, backgroundColor: "#C9A96E33" },
  dividerDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, marginHorizontal: 8 },
  rowContainer: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  imageWrapper: { width: 66, height: 66, justifyContent: "center", alignItems: "center", marginRight: 12 },
  imageRing: { position: "absolute", width: 66, height: 66, borderRadius: 33, borderWidth: 2, borderColor: GOLD },
  itemImage: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: "#C9A96E55" },
  card: { flex: 1, backgroundColor: CARD, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#C9A96E22", overflow: "hidden", position: "relative", shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cardShimmer: { position: "absolute", top: 0, bottom: 0, width: 45, backgroundColor: "#fff", opacity: 0.04, borderRadius: 4, transform: [{ skewX: "-18deg" }] },
  cardShine: { position: "absolute", top: 0, left: 16, right: 16, height: 1, backgroundColor: "#fff", opacity: 0.06 },
  itemName: { fontSize: 17, color: GOLD_LIGHT, fontWeight: "600", letterSpacing: 0.3, marginBottom: 6 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  itemPrice: { color: GOLD_BRIGHT, fontSize: 15, fontWeight: "700", letterSpacing: 0.4 },
  arrowDot: { position: "absolute", right: 14, top: "50%", marginTop: -10 },
  arrowText: { color: "#C9A96E55", fontSize: 22, fontWeight: "300" },
  customBadge: { position: "absolute", top: 12, right: 12, backgroundColor: GOLD, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  customBadgeText: { color: DARK, fontSize: 10, fontWeight: "700" },
});