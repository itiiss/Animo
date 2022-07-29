import { Ref } from 'vue';
import { getTextWidth } from '@/utils/text';

function useTextWidth(labelText: Ref<string>) {
	const labelTextWidth = ref(0);
	watchEffect(() => {
		labelTextWidth.value = getTextWidth(labelText.value);
	});
	return labelTextWidth;
}

export default useTextWidth;
