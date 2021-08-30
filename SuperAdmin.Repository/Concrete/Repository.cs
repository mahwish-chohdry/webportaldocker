using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SuperAdmin.Repository.Interface;

namespace SuperAdmin.Repository.Concrete
{
    public class Repository<T> : BaseRepository<T>, IRepository<T> where T : class
    {
        public Repository(DbContext context) : base(context)
        {

        }

        public void Add(T entity)
        {
            _dbSet.Add(entity);
        }

        public void AddList(IEnumerable<T> entities)
        {
            _dbSet.AddRange(entities);
        }

        public void Update(T entity)
        {
            _dbSet.Update(entity);
        }

        public void UpdateList(IEnumerable<T> entities)
        {
           // _dbSet.UpdateRange(entities);
        }

        public IEnumerable<T> GetList()
        {
            return _dbSet.AsEnumerable().ToList();
        }

        public T Find(int id)
        {
            return _dbSet.Find(id);
        }

        public bool Delete(int id)
        {
            var existing = _dbSet.Find(id);
            if (existing != null)
            {
                _dbSet.Remove(existing);
                return true;
            }
            return false;
        }

        public IQueryable<T> Queryable()
        {
            return _dbSet;
        }

        public void Dispose()
        {
            _dbContext?.Dispose();
        }
    }
}
