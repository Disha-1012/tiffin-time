import { View, Text, TouchableOpacity, Dimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState, useRef } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  SharedValue,          // ← correct named export
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const FOOD_IMAGES = [
  require("../../assets/images/P1.png"),
  require("../../assets/images/P2.png"),
  require("../../assets/images/P3.png"),
  require("../../assets/images/P4.png"),
  require("../../assets/images/P5.png"),
  require("../../assets/images/P6.png"),
  require("../../assets/images/P7.png"),
];

const GOLD = "#C9A96E";
const DARK = "#1A120B";

type SparkleProps = {
  top: number;
  left: number;
  opacity: number;
};

function Sparkle({ top, left, opacity: baseOpacity }: SparkleProps) {
  const opacity = useSharedValue(baseOpacity);

  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 3000,
      withRepeat(
        withSequence(
          withTiming(baseOpacity * 0.1, { duration: 800 + Math.random() * 1200 }),
          withTiming(baseOpacity, { duration: 800 + Math.random() * 1200 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top,
          left,
          width: 3,
          height: 3,
          borderRadius: 2,
          backgroundColor: GOLD,
        },
        animStyle,
      ]}
    />
  );
}

// Each orbit item is its own component — no hooks inside .map()
function OrbitItem({
  image,
  index,
  total,
  rotation,
  converge,
}: {
  image: any;
  index: number;
  total: number;
  rotation: SharedValue<number>;   // ← fixed: was Animated.SharedValue<number>
  converge: SharedValue<number>;   // ← fixed: was Animated.SharedValue<number>
}) {
  const angle = (index / total) * 2 * Math.PI;

  const animatedStyle = useAnimatedStyle(() => {
    const r = rotation.value * (Math.PI / 180);
    const radius = 130 * (1 - converge.value);
    const x = Math.cos(angle + r) * radius;
    const y = Math.sin(angle + r) * radius;

    return {
      opacity: 1 - converge.value,
      transform: [
        { translateX: x },
        { translateY: y },
        { scale: 1 - converge.value * 0.6 },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: 65,
          height: 65,
          borderRadius: 32,
          backgroundColor: "#2A1F14",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#C9A96E55",
        },
        animatedStyle,
      ]}
    >
      <Image
        source={image}
        style={{ width: 55, height: 55, borderRadius: 30, resizeMode: "contain" }}
      />
    </Animated.View>
  );
}

export default function Home() {
  const router = useRouter();

  // Shared values
  const rotation  = useSharedValue(0);   // degrees, unbounded
  const converge  = useSharedValue(0);   // 0 = spread, 1 = converged
  const zoom      = useSharedValue(1);

  const [showCTA, setShowCTA] = useState(false);

  const titleTranslateY = useSharedValue(-20);
  const titleOpacity    = useSharedValue(0);
  const taglineOpacity  = useSharedValue(0);
  const logoScale       = useSharedValue(1);
  const ctaScale        = useSharedValue(0);

  // Track direction: +1 = clockwise, -1 = counter-clockwise
  const directionRef = useRef<1 | -1>(1);
  const loopRef      = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    loopRef.current.forEach(clearTimeout);
    loopRef.current = [];
  };

  const t = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    loopRef.current.push(id);
  };

  const startLoop = () => {
    clearTimers();

    const dir = directionRef.current;

    // ── Title & tagline fade in
    titleTranslateY.value = withTiming(0,  { duration: 700 });
    titleOpacity.value    = withTiming(1,  { duration: 700 });
    taglineOpacity.value  = withDelay(900, withTiming(1, { duration: 600 }));

    // ── Logo gentle breathe
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.07, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.0,  { duration: 1600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // ── Orbit: spin one full revolution in current direction over 4 s
    const target = rotation.value + dir * 360;
    rotation.value = withTiming(target, {
      duration: 4000,
      easing: Easing.inOut(Easing.ease),
    });

    // ── Converge at 3.5 s
    t(() => {
      converge.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) });
      zoom.value     = withTiming(1.05, { duration: 900 });
    }, 3500);

    // ── Show CTA at 5.2 s
    t(() => {
      setShowCTA(true);
      ctaScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    }, 5200);

    // ── Reset & flip direction at 7.5 s, then relaunch
    t(() => {
      setShowCTA(false);
      ctaScale.value = 0;

      converge.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) });
      zoom.value     = withTiming(1,  { duration: 600 });

      titleOpacity.value   = withTiming(0, { duration: 400 });
      taglineOpacity.value = withTiming(0, { duration: 400 });
      titleTranslateY.value = -20;

      // Flip direction for next cycle
      directionRef.current = dir === 1 ? -1 : 1;

      // Relaunch after reset settles
      t(startLoop, 700);
    }, 7500);
  };

  useEffect(() => {
    startLoop();
    return clearTimers; // cleanup on unmount
  }, []);

  // ── Animated styles
  const titleAnimStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const taglineAnimStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  const logoAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const ctaAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ctaScale.value }],
  }));

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoom.value }],
  }));

  const [sparkles] = useState(() =>
    Array.from({ length: 20 }).map(() => ({
      top:     Math.random() * height,
      left:    Math.random() * width,
      opacity: Math.random() * 0.5 + 0.1,
    }))
  );

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          backgroundColor: DARK,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        },
        zoomStyle,
      ]}
    >
      {sparkles.map((s, i) => (
        <Sparkle key={i} top={s.top} left={s.left} opacity={s.opacity} />
      ))}

      <Animated.Text
        style={[
          {
            position: "absolute",
            top: 80,
            fontSize: 30,
            color: GOLD,
            fontWeight: "bold",
          },
          titleAnimStyle,
        ]}
      >
        Tiffin Time
      </Animated.Text>

      {/* ORBIT */}
      <View style={{ width: 320, height: 320, justifyContent: "center", alignItems: "center" }}>
        {FOOD_IMAGES.map((image, index) => (
          <OrbitItem
            key={index}
            image={image}
            index={index}
            total={FOOD_IMAGES.length}
            rotation={rotation}
            converge={converge}
          />
        ))}

        {/* CENTER LOGO */}
        <Animated.View
          style={[
            {
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: GOLD,
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            },
            logoAnimStyle,
          ]}
        >
          <Image
            source={require("../../assets/images/Logo.png")}
            style={{ width: 110, height: 110 }}
          />
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          { color: "#F0D9A8", marginTop: 40, fontStyle: "italic" },
          taglineAnimStyle,
        ]}
      >
        Meet You at Tiffin Break 💛
      </Animated.Text>

      {showCTA && (
        <Animated.View style={ctaAnimStyle}>
          <TouchableOpacity
            style={{
              marginTop: 30,
              backgroundColor: GOLD,
              paddingVertical: 12,
              paddingHorizontal: 30,
              borderRadius: 25,
            }}
            onPress={() => router.push("/menu")}
          >
            <Text style={{ color: "#000", fontSize: 16 }}>Explore Menu</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
}