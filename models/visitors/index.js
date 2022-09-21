const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const visitorsPath = path.join(__dirname, 'visitors.json');

const updateVisitors = async visitors => {
  await fs.writeFile(visitorsPath, JSON.stringify(visitors, null, 2));
};

const getAll = async () => {
  const data = await fs.readFile(visitorsPath);
  return JSON.parse(data);
};

const getById = async id => {
  const visitors = await getAll();
  const result = visitors.find(item => item.id === id);

  return result || null;
};

const add = async ({ firstName, secondName, entryMoment }) => {
  const visitors = await getAll();
  const newVisitor = {
    firstName,
    secondName,
    entryMoment,
    id: nanoid(),
  };
  visitors.push(newVisitor);
  await updateVisitors(visitors);
  return newVisitor;
};

const updateById = async (id, { firstName, secondName, entryMoment }) => {
  const visitors = await getAll();
  const idx = visitors.findIndex(item => item.id === id);
  if (idx === -1) {
    return null;
  }
  visitors[idx] = { id, firstName, secondName, entryMoment };
  await updateVisitors(visitors);
  return visitors[idx];
};

const removeById = async id => {
  const visitors = await getAll();
  const idx = visitors.findIndex(item => item.id === id);
  if (idx === -1) {
    return null;
  }
  const [removedVisitor] = visitors.splice(idx, 1);
  updateVisitors(visitors);
  return removedVisitor;
};

const updateVisitor = async (id, { firstName, secondName, entryMoment }) => {
  const visitors = await listContacts();
  const visitorIndex = visitors.findIndex(visitor => visitor.id === id);
  if (visitorIndex === -1) return null;
  visitors[visitorIndex] = { id, firstName, secondName, entryMoment };
  await fs.writeFile(visitorsPath, JSON.stringify(visitors, null, 2));
  return visitors[visitorIndex];
};

module.exports = {
  getAll,
  getById,
  add,
  updateById,
  removeById,
  updateVisitor,
};
