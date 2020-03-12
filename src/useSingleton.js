import {useInstance, useIsomorphicLayoutEffect} from './util-hooks';
import {deepPreserveProps} from './utils';

export default function useSingletonGenerator(createSingleton) {
  return function useSingleton({disabled = false, overrides = []} = {}) {
    const component = useInstance({
      children: [],
      renders: 1,
    });

    const deps = [component.children.length];

    useIsomorphicLayoutEffect(() => {
      const {children, sourceData} = component;
      const instance = createSingleton(
        children.map(child => child.instance),
        {
          ...sourceData.props,
          popperOptions: sourceData.instance.props.popperOptions,
          overrides,
        },
      );

      component.instance = instance;

      if (disabled) {
        instance.disable();
      }

      return () => {
        instance.destroy();
        component.children = children.filter(
          ({instance}) => !instance.state.isDestroyed,
        );
      };
    }, deps);

    useIsomorphicLayoutEffect(() => {
      if (component.renders === 1) {
        component.renders++;
        return;
      }

      const {instance, sourceData} = component;

      instance.setProps(deepPreserveProps(instance, sourceData.props));

      if (disabled) {
        instance.disable();
      } else {
        instance.enable();
      }
    });

    const source = {
      data: component,
      hook(data) {
        component.sourceData = data;
      },
    };

    const target = {
      hook(data) {
        component.children.push(data);
      },
    };

    return [source, target];
  };
}
