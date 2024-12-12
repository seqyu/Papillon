import { Image, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";
import { Link2 } from "lucide-react-native";
import { useTheme } from "@react-navigation/native";

export const getURLDomain = (url: string, www: true) => {
  return url.replace("https://", "").replace("http://", "").split("/")[0].replace(www ? "www." : "", "");
};

const LinkFavicon = (props: LinkFaviconProps) => {
  const { url, size } = props;
  const finalSize = size || 24;
  const domain = getURLDomain(url);
  const finalUrl = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
  const localUrl = `${FileSystem.cacheDirectory}${domain}.ico`;

  console.log("finalUrl", finalUrl);

  const { colors } = useTheme();

  const [fetchURL, setFetchURL] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const file = await FileSystem.getInfoAsync(localUrl);
      if (file.exists) {
        setFetchURL(localUrl);
        return;
      }

      // check if the file exists
      fetch(finalUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          else {
            const { uri } = await FileSystem.downloadAsync(finalUrl, localUrl);
            setFetchURL(uri);
          }
        });
    })();
  }, [finalUrl, localUrl]);

  if (!fetchURL) {
    return (
      <View>
        <Link2
          size={finalSize}
          color={colors.text + "80"}
          {...props}
        />
      </View>
    );
  }

  return (
    <Image
      source={{ uri: fetchURL }}
      {...props}
      style={[{ width: finalSize, height: finalSize }, props.style]}
      resizeMethod="resize"
    />
  );
};

export default LinkFavicon;