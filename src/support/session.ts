import EncryptedStorage from 'react-native-encrypted-storage';

const NAME = 'perpus_smekpri:sess';

const initial = {
  id: `sess:${Date.now().valueOf()}`,
  token: ''
}

async function init_session(): Promise<Record<string, any>> {
  let session = await EncryptedStorage.getItem(NAME) ?? '{}';
  let data = JSON.parse(session);
  if (!data.id) {
    data = initial;
    await EncryptedStorage.setItem(NAME, JSON.stringify(data));
  }
  return data;
}

export async function get_session(key: string = '') {
  let session = await init_session();
  if (key != '') return key.split('.').reduce((data, key) => {
    return data ? (data[key] || undefined) : undefined;
  }, session);
  return session;
}

export async function set_session(key: string, data: any) {
  let session = await get_session();
  session[key] = data;
  return await EncryptedStorage.setItem(NAME, JSON.stringify(session));
}

export async function destroy_session() {
  EncryptedStorage.setItem(NAME, '{}');
}

export async function check_device_id() {
  let _id = await EncryptedStorage.getItem('device:id') || '';
  return _id.trim() != '';
}

export async function device_id(value?: string) {
  if (value) {
    await EncryptedStorage.setItem('device:id', value);
    return value;
  } else {
    let _id = await EncryptedStorage.getItem('device:id');
    if (!_id) {
      _id = await gen_device_id();
      await EncryptedStorage.setItem('device:id', _id);
    }
    return _id;
  }
}

export async function gen_device_id() {
  return `${Date.now().valueOf()}-${Math.random().toString(16)}`;
}